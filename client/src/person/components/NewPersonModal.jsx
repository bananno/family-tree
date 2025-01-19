import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Input from 'shared/form/Input';
import Modal from 'shared/Modal';

const API_URL = 'http://localhost:9000';

export default function NewPersonModal({}) {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [gender, setGender] = useState('');

  const isValid = name.trim().length > 0;

  async function handleConfirm() {
    const requestBody = { name, gender };
    const response = await fetch(`${API_URL}/people`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    const data = await response.json();
    const newPersonid = data.person.id;
    navigate(`/person/${newPersonid}`);
  }

  return (
    <Modal
      title="New Person"
      confirmEnabled={isValid}
      onConfirm={handleConfirm}
      confirmButtonLabel="Save"
      triggerButtonLabel="Add Person"
    >
      Name:
      <Input value={name} onChange={setName} />
      <br />
      Gender:
      <select value={gender} onChange={e => setGender(e.target.value)}>
        <option value="">select</option>
        <option value="female">female</option>
        <option value="male">male</option>
        <option value="unknown">unknown</option>
      </select>
    </Modal>
  );
}
