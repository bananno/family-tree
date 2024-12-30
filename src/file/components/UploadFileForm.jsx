import React, { useState } from 'react';

const API_URL = 'http://localhost:9000';

export default function UploadFileForm() {
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSelectFile(event) {
    setFile(event.target.files[0]);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setSubmitting(true);

    try {
      await fetch(`${API_URL}/file/upload`, {
        method: 'POST',
        body: formData,
      });

      console.log('success');
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>new file form</h3>
      <input
        type="file"
        onChange={handleSelectFile}
        accept="image/*"
        disabled={submitting}
      />
      <button type="submit" disabled={submitting}>
        Upload
      </button>
    </form>
  );
}
