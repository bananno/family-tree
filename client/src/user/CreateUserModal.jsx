import { useState } from 'react';
import { useForm } from 'react-hook-form';

import api from 'shared/api';
import Input from 'shared/form/Input';
import Modal from 'shared/Modal';

export default function CreateUserModal({ afterCreate }) {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState('');

  async function onSubmit(data) {
    const name = data.name.trim();
    const email = data.email.trim();

    if (!email) {
      return false;
    }

    const { error, result } = await api('/users', {
      catchPlease: true,
      method: 'POST',
      body: { email, name },
    });

    if (error || !result.user) {
      setError(error || 'Something went wrong');
      return false;
    }

    setError('');
    afterCreate();
  }

  return (
    <Modal
      triggerButtonLabel="Create User"
      handleSubmit={handleSubmit}
      onConfirm={onSubmit}
    >
      <h2>Create User</h2>
      {error && (
        <div
          style={{
            color: 'red',
            margin: '10px 0',
          }}
        >
          {error}
        </div>
      )}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          marginTop: '20px',
        }}
      >
        <Input register={register} name="name" placeholder="Name (optional)" />
        <Input register={register} name="email" placeholder="Email" />
      </div>
    </Modal>
  );
}
