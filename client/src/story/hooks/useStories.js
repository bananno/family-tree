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

  const requestUrl = storyType
    ? `api/stories?storyType=${storyType}`
    : 'api/stories';

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
  const types = response.types || [];

  const filteredItems = getFilteredList(filterId, allItems, item => item.title);

  return { stories: filteredItems, types, loading };
}

////////////////////

function getStaticResponse(storyType) {
  const items = storyType
    ? staticDb.stories.filter(story => story.type === storyType)
    : staticDb.stories;

  const types = _.uniq(staticDb.stories.map(story => story.type)).sort();

  return { items, types };
}
