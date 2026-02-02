import { useEffect, useState } from 'react';

import { usePersonContext } from 'person/PersonContext';
import api from 'shared/api';

export default function usePersonPhotos() {
  const { personId } = usePersonContext();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPhotos();
  }, [personId]);

  async function getPhotos() {
    setLoading(true);

    const { result, error } = await api(`/people/${personId}/photos`);

    if (error || !result?.photos) {
      console.error('Error fetching person photos:', error);
    }

    setPhotos(result?.photos || []);
    setLoading(false);
  }

  return { photos, loading };
}
