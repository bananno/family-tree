import { useState } from 'react';
import { useForm } from 'react-hook-form';

import api from 'shared/api';
import Input from 'shared/form/Input';
import Modal from 'shared/Modal';

export default function UserModal({
  create,
  edit,
  afterSubmit,
  editUser,
  onClose,
}) {
  const { register, handleSubmit } = useForm({
    defaultValues: create ? {} : editUser,
  });

  const [error, setError] = useState('');

  async function onSubmit(data) {
    const body = {
      name: data.name.trim(),
    };

    if (create) {
      body.email = body.email.trim();

      if (!body.email) {
        return false;
      }
    }

    const path = create ? '/users' : `/users/${editUser.id}/update`;

    const { error, result } = await api(path, {
      catchPlease: true,
      method: 'POST',
      body,
    });

    if (error) {
      setError(error);
      return false;
    }

    setError('');
    afterSubmit();
    onClose?.();
  }

  return (
    <Modal
      triggerButtonLabel={create && 'Create User'}
      handleSubmit={handleSubmit}
      onConfirm={onSubmit}
      onCancel={onClose}
      open={create ? undefined : true}
    >
      <h2>{create ? 'Create User' : 'Edit User'}</h2>
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
        {create ? (
          <Input register={register} name="email" placeholder="Email" />
        ) : (
          <div>{editUser?.email}</div>
        )}
        <Input register={register} name="name" placeholder="Name (optional)" />
      </div>
    </Modal>
  );
}
