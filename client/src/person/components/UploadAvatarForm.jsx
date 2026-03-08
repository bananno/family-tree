import React, { useRef, useState } from 'react';

import { usePersonContext } from 'person/PersonContext';
import api from 'shared/api';

export default function UploadAvatarForm({ refetch }) {
  const { personId } = usePersonContext();
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef(null);

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
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        onChange={handleSelectFile}
        accept="image/*"
        disabled={submitting}
        className="hidden"
        id="avatar-upload"
      />
      <label
        htmlFor="avatar-upload"
        className={`inline-block px-5 py-2 text-sm rounded border border-gray-400 bg-gray-100
          hover:bg-gray-200 hover:border-gray-500
          ${submitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {submitting ? 'Uploading...' : 'Choose image'}
      </label>
    </div>
  );
}
