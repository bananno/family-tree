import { useState, useEffect } from 'react';

import api from 'shared/api';

export default function useStoriesNonEntrySources() {
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    const { result, error } = await api('api/stories-non-entry-sources', {
      catchPlease: true,
    });
    setResponse(result);
    setLoading(false);
  }

  const allItems = response.items || [];

  return { stories: allItems, loading };
}
