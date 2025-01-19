import React, { useEffect, useState } from 'react';

import UploadFileForm from 'file/components/UploadFileForm';

const API_URL = 'http://localhost:9000';

export default function FilesPage() {
  const { files } = useFiles();

  return (
    <>
      <h2>Files</h2>
      <UploadFileForm />
      <ul>
        {files.map(file => (
          <li key={file.id}>
            {file.filename}
            <img
              src={file.url}
              style={{
                border: '1px solid gray',
                minHeight: '100px',
                maxHeight: '200px',
              }}
            />
          </li>
        ))}
      </ul>
    </>
  );
}

////////////////////

function useFiles() {
  const [files, setFiles] = useState([]);

  async function fetchFiles() {
    const response = await fetch(`${API_URL}/files`);
    const data = await response.json();
    setFiles(data);
  }

  useEffect(() => {
    fetchFiles();
  }, []);

  return { files };
}
