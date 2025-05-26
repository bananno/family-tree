import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { usePersonContext } from 'person/PersonContext';
import api from 'shared/api';
import Button from 'shared/form/Button';
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormSection label="full name">
        <Input name="name" register={register} rules={{ required: true }} />
        {errors.name && <div style={{ color: 'red' }}>{errors.name.type}</div>}
      </FormSection>
      <FormSection label="custom ID">
        <Input name="customId" register={register} />
      </FormSection>
      <FormSection label="share level">
        <Select name="shareLevel" register={register}>
          <option value="0">none (0)</option>
          <option value="1">restricted (1)</option>
          <option value="2">everything (2)</option>
        </Select>
      </FormSection>
      {shareRestricted && (
        <FormSection label="shared name">
          <Input name="shareName" register={register} />
        </FormSection>
      )}
      <FormSection label="gender">
        <Select name="gender" register={register}>
          <option value="">no selection</option>
          <option value="female">female</option>
          <option value="male">male</option>
          <option value="unknown">unknown</option>
        </Select>
      </FormSection>
      <FormSection label="living">
        <Select name="living" register={register}>
          <option>true</option>
          <option>false</option>
        </Select>
      </FormSection>
      {submitError && (
        <div style={{ color: 'red' }}>
          {submitError.message || 'An error occurred while saving.'}
        </div>
      )}
      <Button type="submit" disabled={!isValid}>
        Save
      </Button>
    </form>
  );
}
