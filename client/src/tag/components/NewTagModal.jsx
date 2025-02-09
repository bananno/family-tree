import React, { useRef, useState } from 'react';

import api from 'shared/api';
import Input from 'shared/form/Input';
import Modal from 'shared/Modal';

export default function NewTagModal({}) {
  const [title, setTitle] = useState('');
  const [responseError, setResponseError] = useState('');

  const titleRef = useRef(null);

  function focusInput() {
    titleRef.current?.focus();
  }

  async function handleConfirm() {
    const requestBody = { title };

    const { result, error } = await api('/tags', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      catchPlease: true,
    });

    if (error) {
      setResponseError(error);
      return false;
    }

    setTitle('');
    setResponseError('');
  }

  const valid = title.trim().length > 0;

  return (
    <Modal
      title="Create new tag"
      triggerButtonLabel="Add tag"
      onOpen={focusInput}
      onConfirm={handleConfirm}
      confirmEnabled={valid}
    >
      <Input
        ref={titleRef}
        placeholder="title"
        value={title}
        onChange={setTitle}
      />
      <div style={{ color: 'red' }}>{responseError}</div>
    </Modal>
  );
}
