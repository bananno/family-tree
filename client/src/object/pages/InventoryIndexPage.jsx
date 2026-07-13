import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import ObjectForm from 'object/components/ObjectForm';
import { ROUTE_PATHS } from 'routePaths';
import api from 'shared/api';

export default function InventoryIndexPage() {
  const [objects, setObjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchObjects();
  }, []);

  async function fetchObjects() {
    const { result, error } = await api('/objects');
    if (error) {
      setError(error);
    } else if (result.objects) {
      setObjects(result.objects);
    }
    setLoading(false);
  }

  const headerClass = 'p-3 text-left border border-gray-300 bg-gray-50';
  const cellClass = 'p-3 border border-gray-300';

  return (
    <>
      <h1 className="text-2xl font-bold">Inventory</h1>

      <div className="mt-4">
        <h2 className="text-lg font-semibold text-gray-700">Add an object</h2>
        <ObjectForm afterSave={fetchObjects} submitLabel="Add" />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && objects.length === 0 && (
        <p className="text-gray-500">No objects yet.</p>
      )}

      {objects.length > 0 && (
        <table className="mt-4 border-collapse">
          <thead>
            <tr>
              <th className={headerClass}>Name</th>
              <th className={headerClass}>Created</th>
              <th className={headerClass}></th>
            </tr>
          </thead>
          <tbody>
            {objects.map(object => (
              <tr key={object.id}>
                <td className={cellClass}>{object.name}</td>
                <td className={cellClass}>
                  {new Date(object.createdAt).toLocaleDateString()}
                </td>
                <td className={cellClass}>
                  <Link
                    to={ROUTE_PATHS.objectDetail(object.id)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
