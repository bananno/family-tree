import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import api from 'shared/api';
import Button from 'shared/form/Button';
import FormSection from 'shared/form/FormSection';
import Input from 'shared/form/Input';

// Used for both creating (no `object` prop) and editing an object.
export default function ObjectForm({ object, afterSave, submitLabel = 'Save' }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const defaultValues = { name: object?.name || '' };

  const {
    formState: { isValid, errors },
    handleSubmit,
    register,
    reset,
  } = useForm({ mode: 'onChange', defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [object, reset]);

  async function onSubmit(data) {
    setSubmitError(null);
    setSubmitting(true);

    const path = object ? `/objects/${object.id}/update` : '/objects';

    const { error, result } = await api(path, {
      method: 'POST',
      body: { name: data.name.trim() },
    });

    if (error) {
      setSubmitError(error);
    } else {
      reset(object ? data : { name: '' });
      await afterSave?.(result?.object);
    }

    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg py-2">
      <FormSection label="name" error={errors.name}>
        <Input
          name="name"
          register={register}
          rules={{ required: 'Name is required' }}
        />
      </FormSection>
      {submitError && (
        <div className="text-red-600 text-sm mb-3">
          {submitError.message || submitError || 'An error occurred while saving.'}
        </div>
      )}
      <Button type="submit" disabled={!isValid || submitting} text={submitLabel} />
    </form>
  );
}
