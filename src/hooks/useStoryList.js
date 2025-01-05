import { useState, useEffect } from 'react';

import staticDb from 'staticDb';

import { useStaticDb } from '../SETTINGS';

export default function useStoryList({ storyType }) {
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const requestUrl =
    storyType === 'nonEntrySources'
      ? 'http://localhost:9000/api/story-non-entry-source'
      : storyType
        ? `http://localhost:9000/api/story-index/${storyType}`
        : 'http://localhost:9000/api/story-index';

  useEffect(() => {
    if (useStaticDb) {
      setResponse(getStaticResponse(storyType));
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    fetch(requestUrl)
      .then(res => res.json())
      .then(res => {
        setResponse(res.data);
      })
      .catch(err => {
        console.log('ERROR', err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [storyType]);

  return { stories: response, isLoading };
}

////////////////////

function getStaticResponse(storyType) {
  if (storyType) {
    return staticDb.stories.filter(story => story.type === storyType);
  }
  return staticDb.stories;
}
