import { useState, useEffect } from 'react';

import api from 'shared/api';
import { useFilter } from 'shared/FilterContext';
import useEnvironment from 'shared/useEnvironment';
import staticDb from 'staticDb';

export default function useStories({ storyType, filterId }) {
  const { isProduction } = useEnvironment();
  const [response, setResponse] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getFilteredList } = useFilter();

  const requestUrl = storyType ? `stories?storyType=${storyType}` : 'stories';

  useEffect(() => {
    if (isProduction) {
      setResponse(getStaticResponse(storyType));
      setLoading(false);
      return;
    }
    fetchItems();
  }, [storyType]);

  async function fetchItems() {
    setLoading(true);
    const { result, error } = await api(requestUrl, { catchPlease: true });
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

////////////////////

function getStaticResponse(storyType) {
  const items = storyType
    ? staticDb.stories.filter(story => story.type === storyType)
    : staticDb.stories;

  const types = _.uniq(staticDb.stories.map(story => story.type)).sort();

  return { items, types };
}
