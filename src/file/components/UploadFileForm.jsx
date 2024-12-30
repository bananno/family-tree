import React, { useState } from 'react';

const API_URL = 'http://localhost:9000';

export default function UploadFileForm() {
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [filename, setFilename] = useState('');

  async function handleSelectFile(event) {
    const file = event.target.files[0];
    setFile(file);
    setFilename(file.name.replace(/ /g, '_'));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', filename);

    setSubmitting(true);

    try {
      await fetch(`${API_URL}/files`, {
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
      {file && (
        <>
          <br />
          <br />
          Original name:
          <br />
          <i>{file?.name}</i>
          <br />
          <br />
          Filename and directory: <br />
          <input
            type="text"
            value={filename}
            onChange={e => setFilename(e.target.value)}
            disabled={submitting}
            style={{ width: '500px' }}
          />
          <br />
          <br />
          <button type="submit" disabled={submitting}>
            Upload
          </button>
        </>
      )}
    </form>
  );
}
