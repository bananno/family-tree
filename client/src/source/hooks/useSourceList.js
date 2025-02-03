import { useState, useEffect } from 'react';

import { useFilter } from 'shared/FilterContext';

export default function useSourceList({ sourceType, filterId }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getFilteredList } = useFilter();

  const requestUrl = sourceType
    ? `http://localhost:9000/api/source-index/${sourceType}`
    : 'http://localhost:9000/api/source-index';

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
  }, [sourceType]);

  const filteredItems = getFilteredList(
    filterId,
    items,
    item => item.fullTitle,
  );

  return { sources: filteredItems, isLoading };
}
