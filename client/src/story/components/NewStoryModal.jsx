import React, { useState } from 'react';
import ReactSelect from 'react-select';

import api from 'shared/api';
import DateInput from 'shared/form/DateInput';
import FormSection from 'shared/form/FormSection';
import Input from 'shared/form/Input';
import LocationInput from 'shared/form/LocationInput';
import Modal from 'shared/Modal';

export default function NewStoryModal({ kind, types = [] }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState(null);
  const [otherType, setOtherType] = useState('other');
  const [date, setDate] = useState({});
  const [loc, setLoc] = useState({ country: 'United States' });
  const [responseError, setResponseError] = useState('');

  const typeOptions = types.map(type => ({
    value: type,
    label: type,
  }));

  if (!types.includes('other')) {
    typeOptions.push({
      value: 'other',
      label: 'Other',
    });
  }

  const modalLabel = kind === 'cemetery' ? 'New cemetery' : 'New story';
  const editableType = !kind;

  const effectiveType =
    kind === 'cemetery'
      ? 'cemetery'
      : type?.value === 'other'
        ? otherType
        : type?.value || '';

  const valid = title.trim().length > 0 && effectiveType.trim().length > 0;

  const showDateFields =
    effectiveType &&
    ['book', 'event', 'document', 'other'].includes(effectiveType);

  const showLocationFields =
    effectiveType && !['artifact', 'book'].includes(effectiveType);

  async function handleConfirm() {
    const requestBody = {
      title,
      kind,
      type: effectiveType,
      date: showDateFields ? date : undefined,
      location: showLocationFields ? loc : undefined,
    };

    const { result, error } = await api('stories', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      catchPlease: true,
    });

    if (error) {
      setResponseError(error);
      return false;
    }

    const newStoryId = result.story.id;
    window.location.href = `/story/${newStoryId}`;
  }

  return (
    <Modal
      title={modalLabel}
      triggerButtonLabel={modalLabel}
      onConfirm={handleConfirm}
      confirmEnabled={valid}
    >
      {editableType && (
        <FormSection label="type">
          <ReactSelect
            options={typeOptions}
            value={type}
            onChange={setType}
            closeMenuOnSelect
          />
        </FormSection>
      )}
      {type?.value === 'other' && (
        <FormSection label="other type">
          <Input
            value={otherType}
            onChange={setOtherType}
            placeholder="Enter other type"
            style={{ display: 'block', marginTop: '0.5rem' }}
          />
        </FormSection>
      )}
      <FormSection label="title">
        <Input value={title} onChange={setTitle} />
      </FormSection>
      {showDateFields && (
        <FormSection label="date">
          <DateInput value={date} onChange={setDate} />
        </FormSection>
      )}
      {showLocationFields && (
        <FormSection label="location">
          <LocationInput value={loc} onChange={setLoc} />
        </FormSection>
      )}
      <div style={{ color: 'red' }}>{responseError}</div>
    </Modal>
  );
}
