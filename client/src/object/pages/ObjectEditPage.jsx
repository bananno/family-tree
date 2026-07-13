import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ObjectForm from 'object/components/ObjectForm';
import { ROUTE_PATHS } from 'routePaths';
import api from 'shared/api';

export default function ObjectEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [object, setObject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error || !object) {
    return <p className="text-red-600">Error: {error || 'Object not found'}</p>;
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold">Edit {object.name}</h1>
      <ObjectForm
        object={object}
        afterSave={() => navigate(ROUTE_PATHS.objectDetail(object.id))}
      />
    </div>
  );
}
