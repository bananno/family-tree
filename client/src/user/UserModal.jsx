import { useState } from 'react';
import { useForm } from 'react-hook-form';

import api from 'shared/api';
import Input from 'shared/form/Input';
import Select from 'shared/form/Select';
import Modal from 'shared/Modal';

export default function UserModal({
  create,
  afterSubmit,
  editUser,
  onClose,
  unlinkedPeople,
}) {
  const { register, handleSubmit } = useForm({
    defaultValues: create
      ? {}
      : {
          name: editUser.name,
          person: editUser.person?.id,
        },
  });

  const [error, setError] = useState('');

  async function onSubmit(data) {
    const body = {
      name: data.name.trim(),
      person: data.person || null,
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
        <Select
          register={register}
          name="person"
          placeholder="Link to person (optional)"
        >
          <option value="">-- person in tree --</option>
          {editUser?.person && (
            <option value={editUser.person.id}>{editUser.person.name}</option>
          )}
          {unlinkedPeople.map(person => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </Select>
      </div>
    </Modal>
  );
}
