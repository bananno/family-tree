import React, { useState } from 'react';

import Button from 'shared/form/Button';

const API_URL = 'http://localhost:9000';

export default function UtilitiesPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [isError, setIsError] = useState(false);

  function onExportFullDatabase() {
    setIsError(false);
    setIsExporting(true);

    fetch(`${API_URL}/export/full`)
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

    fetch(`${API_URL}/export/publish`)
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
      <Button
        onClick={onExportPublishedDatabase}
        disabled={isExporting}
        text="export published database"
      />
      <Button
        onClick={onExportFullDatabase}
        disabled={isExporting}
        text="export full database backup"
      />
    </>
  );
}
