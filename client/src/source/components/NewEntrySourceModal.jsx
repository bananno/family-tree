import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Input from 'shared/form/Input';
import Modal from 'shared/Modal';

const API_URL = 'http://localhost:9000';

export default function NewEntrySourceModal({ story }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');

  const isValid = title.trim().length > 0;

  async function handleConfirm() {
    const requestBody = { title, storyId: story.id };
    const response = await fetch(`${API_URL}/sources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    const data = await response.json();
    const newSourceId = data.source.id;
    navigate(`/source/${newSourceId}`);
  }

  return (
    <Modal
      title="New entry source"
      confirmEnabled={isValid}
      onConfirm={handleConfirm}
      confirmButtonLabel="Save"
      triggerButtonLabel="New entry"
    >
      Story: {story.title}
      <br />
      Source title:
      <Input value={title} onChange={setTitle} />
    </Modal>
  );
}
