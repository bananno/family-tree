import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import api from 'shared/api';
import Button from 'shared/form/Button';
import ButtonSelector from 'shared/form/ButtonSelector';
import FormSection from 'shared/form/FormSection';
import Input from 'shared/form/Input';
import useStoryContext from 'story/hooks/useStoryContext';

export default function StoryEditPage() {
  const { story, refetch } = useStoryContext();
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const defaultValues = {
    notes: story.notes,
    notesMarkdown: story.notesMarkdown ? 'true' : 'false',
    sharing: story.sharing ? 'true' : 'false',
    summary: story.summary,
    title: story.title,
  };

  const {
    formState: { isValid, errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm({ mode: 'onChange', defaultValues });

  useEffect(() => {
    reset(defaultValues);
  }, [story, reset]);

  async function onSubmit(data) {
    setSubmitError(null);

    const requestBody = {
      ...data,
    };

    try {
      setLoading(true);

      await api(`stories/${story.id}`, {
        method: 'PATCH',
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
      <FormSection label="title">
        <Input
          name="title"
          register={register}
          rules={{ required: 'Title is required' }}
        />
        {errors.title && (
          <div className="text-red-600 text-sm mt-1">{errors.title.type}</div>
        )}
      </FormSection>
      <FormSection label="sharing">
        <ButtonSelector
          value={watch('sharing')}
          onChange={val => setValue('sharing', val)}
          options={[
            { value: 'true', label: 'true' },
            { value: 'false', label: 'false' },
          ]}
        />
      </FormSection>
      <FormSection label="summary">
        <Input name="summary" register={register} textarea />
        {errors.summary && (
          <div className="text-red-600 text-sm mt-1">{errors.summary.type}</div>
        )}
      </FormSection>
      <FormSection label="notes">
        <ButtonSelector
          value={watch('notesMarkdown')}
          onChange={val => setValue('notesMarkdown', val)}
          options={[
            { value: 'true', label: 'markdown' },
            { value: 'false', label: 'legacy' },
          ]}
        />
        <Input name="notes" register={register} textarea />
        {errors.notes && (
          <div className="text-red-600 text-sm mt-1">{errors.notes.type}</div>
        )}
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
