import { useState, useEffect } from 'react';

import { useFilter } from 'shared/FilterContext';
import useEnvironment from 'shared/useEnvironment';
import staticDb from 'staticDb';

export default function useStoryList({ storyType, filterId }) {
  const { isProduction } = useEnvironment();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getFilteredList } = useFilter();

  const requestUrl =
    storyType === 'nonEntrySources'
      ? 'http://localhost:9000/api/story-non-entry-source'
      : storyType
        ? `http://localhost:9000/api/story-index/${storyType}`
        : 'http://localhost:9000/api/story-index';

  useEffect(() => {
    if (isProduction) {
      setItems(getStaticResponse(storyType));
      setIsLoading(false);
      return;
    }
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
  }, [storyType]);

  const filteredItems = getFilteredList(filterId, items, item => item.title);

  return { stories: filteredItems, isLoading };
}

////////////////////

function getStaticResponse(storyType) {
  if (storyType) {
    return staticDb.stories.filter(story => story.type === storyType);
  }
  return staticDb.stories;
}
