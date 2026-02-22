import React, { useEffect, useState } from 'react';

import UploadFileForm from 'file/components/UploadFileForm';
import useSessionContext from 'session/useSessionContext';
import api from 'shared/api';

export default function FilesPage() {
  const { admin } = useSessionContext();
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);

  async function fetchFiles() {
    const { error, result } = await api(`/files`);

    setError(error);
    setFiles(result?.items || []);
  }

  useEffect(() => {
    fetchFiles();
  }, [admin]);

  if (!admin) {
    return <p>This page is private.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-3xl font-bold">Files</h2>
      <h3 className="text-xl font-bold">new file form</h3>
      <UploadFileForm />
      {error && <p className="text-red-500">{error}</p>}
      <h3 className="text-xl font-bold">files</h3>
      <p>
        Number of items: {files.length}
      </p>
      <ul>
        {files.map(file => (
          <li key={file.id} className="border-t border-gray-300 py-4">
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
    </div>
  );
}
