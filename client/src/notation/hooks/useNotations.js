import { useState, useEffect } from 'react';

import api from 'shared/api';
import { useFilter } from 'shared/FilterContext';

export default function useNotations({ filterId, fullContent }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getFilteredList } = useFilter();

  useEffect(() => {
    fetchItems();
  }, [fullContent]);

  async function fetchItems() {
    setLoading(true);
    const path = fullContent
      ? 'api/notations?fullContent=true'
      : 'api/notations';
    const { result, error } = await api(path, { catchPlease: true });
    setItems(result.items || []);
    setLoading(false);
  }

  const filteredItems = getFilteredList(
    filterId,
    items,
    item => item.filterText,
  );

  return { notations: filteredItems, loading };
}
