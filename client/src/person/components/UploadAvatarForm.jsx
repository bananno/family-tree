import React, { useState } from 'react';

import { usePersonContext } from 'person/PersonContext';
import api from 'shared/api';

export default function UploadAvatarForm({ refetch }) {
  const { personId } = usePersonContext();
  const [submitting, setSubmitting] = useState(false);

  async function handleSelectFile(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setSubmitting(true);

    try {
      await api(`people/${personId}/avatars`, {
        method: 'POST',
        body: formData,
        headers: {}, // overwrite api headers
      });
      refetch();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <input
      type="file"
      onChange={handleSelectFile}
      accept="image/*"
      disabled={submitting}
    />
  );
}
