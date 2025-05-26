import _ from 'lodash';
import React, { useEffect, useState } from 'react';

import api from 'shared/api';
import Modal from 'shared/Modal';
import { useTagContext } from 'tag/TagContext';

export default function DeleteTagModal() {
  const { tag, setWasDeleted } = useTagContext();

  const [responseError, setResponseError] = useState('');

  async function onSubmit(data) {
    const { result, error } = await api(`/tags/${tag.id}`, {
      method: 'DELETE',
      catchPlease: true,
    });

    if (error) {
      setResponseError(JSON.stringify(error));
      return false;
    }

    setResponseError('');
    setWasDeleted(true);
  }

  return (
    <Modal title="Delete tag?" triggerButtonLabel="Delete" onConfirm={onSubmit}>
      {responseError && (
        <div style={{ color: 'red' }}>
          <p>Error deleting tag:</p>
          <pre>{responseError}</pre>
        </div>
      )}
    </Modal>
  );
}
