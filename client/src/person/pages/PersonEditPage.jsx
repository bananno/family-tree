import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { usePersonContext } from 'person/PersonContext';
import api from 'shared/api';
import Button from 'shared/form/Button';
import ButtonSelector from 'shared/form/ButtonSelector';
import FormSection from 'shared/form/FormSection';
import Input from 'shared/form/Input';
import Select from 'shared/form/Select';

export default function PersonEditPage() {
  const { person, refetch } = usePersonContext();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const defaultValues = {
    customId: person.customId,
    gender: person.gender,
    name: person.name,
    shareLevel: person.shareLevel,
    shareName: person.shareName,
    living: person.living,
  };

  const {
    formState: { isValid, errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm({ mode: 'onChange', defaultValues });

  // In case the changed data does not match what was submitted for some reason,
  // the form is reset to the most current person data.
  useEffect(() => {
    reset(defaultValues);
  }, [person, reset]);

  const shareRestricted = [1, '1'].includes(watch('shareLevel'));

  async function onSubmit(data) {
    setSubmitError(null);

    const shareLevel = Number(data.shareLevel);
    const requestBody = {
      ...data,
      shareLevel,
      shareName: shareRestricted ? data.shareName : undefined,
      living: data.living === 'true',
    };

    try {
      setLoading(true);

      await api(`people/${person.id}`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        catchPlease: true,
      });

      await refetch();
    } catch (error) {
      setSubmitError(error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg py-2">
      <FormSection label="full name">
        <Input name="name" register={register} rules={{ required: true }} />
        {errors.name && (
          <div className="text-red-600 text-sm mt-1">{errors.name.type}</div>
        )}
      </FormSection>
      <FormSection label="custom ID">
        <Input name="customId" register={register} />
      </FormSection>
      <FormSection label="share level">
        <ButtonSelector
          value={watch('shareLevel')}
          onChange={val => setValue('shareLevel', val)}
          options={[
            { value: '0', label: 'none' },
            { value: '1', label: 'restricted' },
            { value: '2', label: 'everything' },
          ]}
        />
      </FormSection>
      {shareRestricted && (
        <FormSection label="shared name">
          <Input name="shareName" register={register} />
        </FormSection>
      )}
      <FormSection label="gender">
        <ButtonSelector
          value={watch('gender')}
          onChange={val => setValue('gender', val)}
          options={[
            { value: '', label: 'no selection' },
            { value: 'female', label: 'female' },
            { value: 'male', label: 'male' },
            { value: 'unknown', label: 'unknown' },
          ]}
        />
      </FormSection>
      <FormSection label="living">
        <ButtonSelector
          value={watch('living')}
          onChange={val => setValue('living', val)}
          options={[
            { value: 'true', label: 'true' },
            { value: 'false', label: 'false' },
          ]}
        />
      </FormSection>
      {submitError && (
        <div className="text-red-600 text-sm mb-3">
          {submitError.message || 'An error occurred while saving.'}
        </div>
      )}
      <Button type="submit" disabled={!isValid}>
        Save
      </Button>
    </form>
  );
}
