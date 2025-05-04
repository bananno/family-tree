import { useState, useEffect } from 'react';

import api from 'shared/api';
import { useFilter } from 'shared/FilterContext';

export default function useTags({ filterId } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getFilteredList } = useFilter();

  async function fetchTags() {
    setLoading(true);
    const { result } = await api('tags', { catchPlease: true });
    setItems(result?.items || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchTags();
  }, []);

  const filteredItems = getFilteredList(filterId, items, item =>
    [item.title, item.definition || ''].join(' '),
  );

  return { tags: filteredItems, loading, refetch: fetchTags };
}
