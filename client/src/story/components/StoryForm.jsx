import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import PersonListEditor from 'person/components/PersonListEditor';
import api from 'shared/api';
import Button from 'shared/form/Button';
import ButtonSelector from 'shared/form/ButtonSelector';
import FormSection from 'shared/form/FormSection';
import Input from 'shared/form/Input';

export default function StoryForm({ story, afterSave }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const defaultValues = {
    citationText: story.citationText,
    notes: story.notes,
    notesMarkdown: story.notesMarkdown ? 'true' : 'false',
    people: story.people,
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
      people: data.people.map(p => p.id),
    };

    setSubmitting(true);

    const { error } = await api(`stories/${story.id}`, {
      method: 'PATCH',
      body: requestBody,
    });

    if (error) {
      setSubmitError(error);
    } else {
      await afterSave();
    }

    setSubmitting(false);
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
        <div className="space-y-2">
          <ButtonSelector
            value={watch('notesMarkdown')}
            onChange={val => setValue('notesMarkdown', val)}
            options={[
              { value: 'true', label: 'markdown' },
              { value: 'false', label: 'legacy' },
            ]}
          />
          <Input name="notes" register={register} textarea />
        </div>
        {errors.notes && (
          <div className="text-red-600 text-sm mt-1">{errors.notes.type}</div>
        )}
      </FormSection>
      <FormSection label="people">
        <StoryPeopleField
          currentPeople={watch('people')}
          onChange={val => setValue('people', val)}
        />
      </FormSection>
      <FormSection label="citationText">
        <Input name="citationText" register={register} textarea />
        {errors.citationText && (
          <div className="text-red-600 text-sm mt-1">
            {errors.citationText.type}
          </div>
        )}
      </FormSection>
      {submitError && (
        <div className="text-red-600 text-sm mb-3">
          {submitError.message || 'An error occurred while saving.'}
        </div>
      )}
      <Button type="submit" disabled={!isValid || submitting}>
        Save
      </Button>
    </form>
  );
}

////////////////////

function StoryPeopleField({ currentPeople, onChange }) {
  function handleAddPerson(person) {
    onChange([...currentPeople, person]);
  }

  function handleRemovePerson(personId) {
    onChange(currentPeople.filter(p => p.id !== personId));
  }

  // onReorder passes the index of the person that should move up
  function handleReorderPeople(fromIndex) {
    const toIndex = fromIndex - 1;
    const updatedPeople = [...currentPeople];
    const swappedPerson = updatedPeople[fromIndex];
    updatedPeople[fromIndex] = updatedPeople[toIndex];
    updatedPeople[toIndex] = swappedPerson;
    onChange(updatedPeople);
  }

  return (
    <PersonListEditor
      currentPeople={currentPeople}
      onAdd={handleAddPerson}
      onRemove={handleRemovePerson}
      onReorder={handleReorderPeople}
      singleColumn
    />
  );
}
