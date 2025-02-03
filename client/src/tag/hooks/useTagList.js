import { useState, useEffect } from 'react';

import { useFilter } from 'shared/FilterContext';

export default function useTagList({ displayType, filterId } = {}) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getFilteredList } = useFilter();

  const requestUrl = displayType
    ? `http://localhost:9000/api/tag-index/${displayType}`
    : 'http://localhost:9000/api/tag-index';

  useEffect(() => {
    setIsLoading(true);
    fetch(requestUrl)
      .then(res => res.json())
      .then(res => {
        setItems(res.data);
      })
      .catch(err => {
        console.log('ERROR', err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [displayType]);

  const filteredItems = getFilteredList(filterId, items, item =>
    [item.title, item.definition || ''].join(' '),
  );

  return { tags: filteredItems, isLoading };
}
