import React, { useState } from 'react';

export default function UtilitiesPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [isError, setIsError] = useState(false);

  function onExportFullDatabase() {
    setIsError(false);
    setIsExporting(true);

    fetch('http://localhost:9000/api/export/full')
      .catch(err => {
        console.log('ERROR', err.message);
        setIsError(true);
      })
      .finally(() => {
        setIsExporting(false);
      });
  }

  function onExportPublishedDatabase() {
    setIsError(false);
    setIsExporting(true);

    fetch('http://localhost:9000/api/export/publish')
      .catch(err => {
        console.log('ERROR', err.message);
        setIsError(true);
      })
      .finally(() => {
        setIsExporting(false);
      });
  }

  return (
    <>
      <h1>Utilities</h1>
      <p>{isExporting ? 'exporting...' : 'done'}</p>
      <button onClick={onExportPublishedDatabase} disabled={isExporting}>
        export published database
      </button>
      <button onClick={onExportFullDatabase} disabled={isExporting}>
        export full database backup
      </button>
    </>
  );
}
