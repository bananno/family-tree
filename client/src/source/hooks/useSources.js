import { useState, useEffect } from 'react';

import api from 'shared/api';
import { useFilter } from 'shared/FilterContext';

export default function useSources({ sourceType, filterId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getFilteredList } = useFilter();

  const requestUrl = sourceType ? `sources/${sourceType}` : 'sources';

  useEffect(() => {
    fetchItems();
  }, [sourceType]);

  async function fetchItems() {
    setLoading(true);
    const { result, error } = await api(requestUrl, { catchPlease: true });
    setItems(result.items || []);
    setLoading(false);
  }

  const filteredItems = getFilteredList(
    filterId,
    items,
    item => item.filterText,
  );

  return { sources: filteredItems, loading };
}
