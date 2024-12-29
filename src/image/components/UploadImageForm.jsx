import React from 'react';

const API_URL = 'http://localhost:9000';

export default function UploadImageForm() {
  async function handleSelectFile(event) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }


    const formData = new FormData();
    formData.append('image', file);

    await fetch(`${API_URL}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    console.log('success');
  }

  return (
    <>
      <h3>new image form</h3>
      <input type="file" onChange={handleSelectFile} accept="image/*" />
    </>
  );
}
