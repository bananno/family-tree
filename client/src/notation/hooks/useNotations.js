import { useState, useEffect } from 'react';

import useSessionContext from 'session/useSessionContext';
import api from 'shared/api';
import { useFilter } from 'shared/FilterContext';

export default function useNotations({ filterId, fullContent }) {
  const { currentUser } = useSessionContext();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getFilteredList } = useFilter();

  async function fetchNotations() {
    setLoading(true);

    const path = fullContent ? '/notations?fullContent=true' : '/notations';
    const { result } = await api(path);

    setItems(result.items || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchNotations();
  }, [currentUser, fullContent]);

  const filteredItems = getFilteredList(
    filterId,
    items,
    item => item.filterText,
  );

  return { notations: filteredItems, loading };
}
