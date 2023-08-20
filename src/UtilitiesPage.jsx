import React, {useState} from 'react';

function UtilitiesPage() {
  const [isExporting, setIsExporting] = useState(false);

  const onExportFullDatabase = () => {
    setIsExporting(true);

    fetch('http://localhost:9000/api/export/full')
      .catch((err) => {
        console.log('ERROR', err.message);
      })
      .finally(() => {
        setIsExporting(false);
      });
  };

  const onExportPublishedDatabase = () => {
    setIsExporting(true);

    fetch('http://localhost:9000/api/export/publish')
      .catch((err) => {
        console.log('ERROR', err.message);
      })
      .finally(() => {
        setIsExporting(false);
      });
  };

  return (
    <div>
      <h2>utilities</h2>
      <p>{isExporting ? 'exporting...' : 'done'}</p>
      <button onClick={onExportPublishedDatabase} disabled={isExporting}>export published database</button>
      <button onClick={onExportFullDatabase} disabled={isExporting}>export full database backup</button>
    </div>
  );
}

export default UtilitiesPage;
