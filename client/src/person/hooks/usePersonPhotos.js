import { useEffect, useState } from 'react';

import { usePersonContext } from 'person/PersonContext';
import useEnvironment from 'shared/useEnvironment';

const API_URL = 'http://localhost:9000';

export default function usePersonPhotos() {
  const { personId } = usePersonContext();
  const { isProduction } = useEnvironment();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    if (isProduction) {
      setPhotos(getStaticResponse(personId));
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/people/${personId}/photos`)
      .then(res => res.json())
      .then(res => {
        setPhotos(res.photos);
      })
      .catch(err => {
        console.log('ERROR', err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isProduction, personId]);

  return { photos, loading };
}

////////////////////

// TODO
function getStaticResponse(personId) {
  return [];
}
