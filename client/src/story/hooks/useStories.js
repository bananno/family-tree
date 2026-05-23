import { useState, useEffect } from 'react';

import api from 'shared/api';
import { useFilter } from 'shared/FilterContext';

export default function useStories({ storyType, filterId }) {
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getFilteredList } = useFilter();

  const requestUrl = storyType ? `stories?storyType=${storyType}` : 'stories';

  useEffect(() => {
    fetchItems();
  }, [storyType]);

  async function fetchItems() {
    setLoading(true);
    const { result, error } = await api(requestUrl);
    setResponse(result);
    setLoading(false);
  }

  const allItems = response.items || [];
  const allTypes = response.allTypes || [];
  const createableTypes = response.createableTypes || [];

  const filteredItems = getFilteredList(
    filterId,
    allItems,
    item => item.filterText,
  );

  return { stories: filteredItems, allTypes, createableTypes, loading };
}
