import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import api from 'shared/api';
import Input from 'shared/form/Input';
import Modal from 'shared/Modal';

// TODO: add a tag context instead of passing refetch around
export default function EditTagModal({ tag, refetch }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm({ mode: 'onChange', defaultValues: tag });

  useEffect(() => {
    reset(tag);
  }, [tag, reset]);

  const [responseError, setResponseError] = useState('');

  async function onSubmit(data) {
    const requestBody = {
      ..._.pick(data, ['title']),
    };

    const { result, error } = await api(`/tags/${tag.id}`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      catchPlease: true,
    });

    if (error) {
      setResponseError(JSON.stringify(error));
      return false;
    }

    setResponseError('');
    await refetch();
  }

  return (
    <Modal
      title="Edit tag"
      triggerButtonLabel="Edit"
      handleSubmit={handleSubmit}
      onConfirm={onSubmit}
      confirmEnabled={isValid}
    >
      <Input name="title" register={register} rules={{ required: true }} />
      <div style={{ color: 'red' }}>{responseError}</div>
    </Modal>
  );
}
