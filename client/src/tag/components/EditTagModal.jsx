import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import ReactSelect from 'react-select';

import api from 'shared/api';
import FormSection from 'shared/form/FormSection';
import Input from 'shared/form/Input';
import Select from 'shared/form/Select';
import Modal from 'shared/Modal';
import useTags from 'tag/hooks/useTags';

const TAGABLE_MODEL_NAMES = [
  'events',
  'images',
  'notations',
  'people',
  'sources',
  'stories',
  'tags',
];

// TODO: add a tag context instead of passing refetch around
export default function EditTagModal({ tag, refetch }) {
  const { tags } = useTags({ allowedForModel: 'tags' });

  const defaultValues = {
    ..._.pick(tag, ['id', 'definition', 'category', 'title', 'valueType']),
    valueOptions: tag.valueOptions?.join('\n') || '',
    tags: tag.tags?.map(metaTagToOption) || [],
    restrictModels: tag.restrictedToModels?.length > 0,
    restrictedToModels: tag.restrictedToModels?.map(tagableModelToOption) || [],
  };

  const {
    control,
    formState: { isValid },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm({ mode: 'onChange', defaultValues });

  useEffect(() => {
    resetForm();
  }, [tag, reset]);

  const [responseError, setResponseError] = useState('');

  const showValueOptions = [2, '2'].includes(watch('valueType'));
  const restrictModels = watch('restrictModels');

  const tagOptions = tags.map(metaTagToOption);
  const tagableModelOptions = TAGABLE_MODEL_NAMES.map(tagableModelToOption);

  async function onSubmit(data) {
    const requestBody = {
      ..._.pick(data, [
        'title',
        'definition',
        'category',
        'valueType',
        'restrictModels',
      ]),
      valueOptions: data.valueOptions
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean),
      tags: data.tags.map(({ value }) => value),
      restrictedToModels: data.restrictedToModels.map(({ value }) => value),
    };

    const { result, error } = await api(`/tags/${tag.id}`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      catchPlease: true,
    });

    if (error) {
      setResponseError(JSON.stringify(error));
      return false;
    }

    setResponseError('');
    await refetch();
  }

  function resetForm() {
    reset(defaultValues);
  }

  return (
    <Modal
      title="Edit tag"
      triggerButtonLabel="Edit"
      handleSubmit={handleSubmit}
      onConfirm={onSubmit}
      confirmEnabled={isValid}
      onCancel={resetForm}
    >
      <FormSection label="title">
        <Input name="title" register={register} rules={{ required: true }} />
      </FormSection>
      <FormSection label="definition">
        <Input name="definition" register={register} textarea />
      </FormSection>
      <FormSection label="category">
        <Input name="category" register={register} />
      </FormSection>
      <FormSection label="value type">
        <Select name="valueType" register={register}>
          <option value="0">tag value not applicable</option>
          <option value="1">use text text input</option>
          <option value="2">use list of preset values</option>
        </Select>
      </FormSection>
      {showValueOptions && (
        <FormSection label="value options">
          <Input
            name="valueOptions"
            register={register}
            rules={{ required: true }}
            textarea
          />
        </FormSection>
      )}
      <FormSection label="meta tags">
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <ReactSelect
              isMulti
              options={tagOptions}
              value={field.value}
              onChange={selected => field.onChange(selected)}
              closeMenuOnSelect
            />
          )}
        />
      </FormSection>
      <FormSection>
        <label>
          <input type="checkbox" {...register('restrictModels')} /> restrict
          models
        </label>
        {restrictModels && (
          <Controller
            name="restrictedToModels"
            control={control}
            render={({ field }) => (
              <ReactSelect
                isMulti
                options={tagableModelOptions}
                value={field.value}
                onChange={selected => field.onChange(selected)}
                closeMenuOnSelect
              />
            )}
          />
        )}
      </FormSection>
      <div style={{ color: 'red' }}>{responseError}</div>
    </Modal>
  );
}

////////////////////

function tagableModelToOption(model) {
  return {
    value: model,
    label: model,
  };
}

function metaTagToOption(tag) {
  return {
    value: tag.id,
    label: tag.title,
  };
}
