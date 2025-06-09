import React, { useState } from 'react';
import ReactSelect from 'react-select';

import api from 'shared/api';
import FormSection from 'shared/form/FormSection';
import Input from 'shared/form/Input';
import Modal from 'shared/Modal';

export default function NewStoryModal({ types = [] }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState(null);
  const [otherType, setOtherType] = useState('other');
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

  const effectiveType = type?.value === 'other' ? otherType : type?.value || '';

  const valid = title.trim().length > 0 && effectiveType.trim().length > 0;

  async function handleConfirm() {
    const requestBody = {
      title,
      type: effectiveType,
    };

    const { result, error } = await api('api/stories', {
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
      title="New story"
      triggerButtonLabel="New story"
      onConfirm={handleConfirm}
      confirmEnabled={valid}
    >
      <FormSection label="type">
        <ReactSelect
          options={typeOptions}
          value={type}
          onChange={setType}
          closeMenuOnSelect
        />
      </FormSection>
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
      <div style={{ color: 'red' }}>{responseError}</div>
    </Modal>
  );
}
