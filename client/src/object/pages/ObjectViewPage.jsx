import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { ROUTE_PATHS } from 'routePaths';
import api from 'shared/api';
import Button from 'shared/form/Button';

export default function ObjectViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [object, setObject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchObject();
  }, [id]);

  async function fetchObject() {
    const { result, error } = await api(`/objects/${id}`);
    if (error) {
      setError(error);
    } else if (result.object) {
      setObject(result.object);
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${object.name}"?`)) {
      return;
    }

    setDeleting(true);

    const { error } = await api(`/objects/${object.id}`, { method: 'DELETE' });

    if (error) {
      setError(error);
      setDeleting(false);
    } else {
      navigate(ROUTE_PATHS.inventoryIndex);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error || !object) {
    return <p className="text-red-600">Error: {error || 'Object not found'}</p>;
  }

  const labelClass = 'text-sm font-semibold text-gray-500';

  return (
    <div className="max-w-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{object.name}</h1>
        <div className="flex items-center gap-4">
          <Link
            to={ROUTE_PATHS.objectDetailEdit(object.id)}
            className="text-blue-600 hover:underline"
          >
            Edit
          </Link>
          <Button text="Delete" onClick={handleDelete} disabled={deleting} />
        </div>
      </div>

      <dl className="mt-6 space-y-3">
        <div>
          <dt className={labelClass}>Created</dt>
          <dd>{new Date(object.createdAt).toLocaleString()}</dd>
        </div>
        <div>
          <dt className={labelClass}>Updated</dt>
          <dd>{new Date(object.updatedAt).toLocaleString()}</dd>
        </div>
      </dl>

      <div className="mt-6">
        <Link
          to={ROUTE_PATHS.inventoryIndex}
          className="text-blue-600 hover:underline"
        >
          ← Back to inventory
        </Link>
      </div>
    </div>
  );
}
