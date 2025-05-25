import { useState, useEffect } from 'react';

import api from 'shared/api';
import { useFilter } from 'shared/FilterContext';

// allowedForModel should be lowercase and plural, e.g. 'people'.
export default function useTags({ allowedForModel, filterId } = {}) {
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

  // TODO: move this filtering to backend
  if (allowedForModel) {
    const reallyFiltered = filteredItems.filter(
      item =>
        item.restrictedToModels.length === 0 ||
        item.restrictedToModels.includes(allowedForModel),
    );
    return { tags: reallyFiltered, loading, refetch: fetchTags };
  }

  return { tags: filteredItems, loading, refetch: fetchTags };
}
