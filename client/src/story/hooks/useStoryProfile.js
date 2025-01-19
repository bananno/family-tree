import { useState, useEffect } from 'react';

import useEnvironment from 'shared/useEnvironment';
import staticDb from 'staticDb';

const API_URL = 'http://localhost:9000';

export default function useStoryProfile({ storyId }) {
  const { isProduction } = useEnvironment();
  const [response, setResponse] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isProduction) {
      setResponse(getStaticResponse(storyId));
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    fetch(`${API_URL}/api/stories/${storyId}`)
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
  }, [storyId]);

  return { story: response, isLoading };
}

////////////////////

function getStaticResponse(storyId) {
  const story = staticDb.stories.find(story => story.id === storyId);
  return {
    ...story,
    people: story.personIds.map(findPerson),
    entries: staticDb.sources.filter(source => source.storyId === storyId),
    nonEntrySources: staticDb.sources.filter(source =>
      source.storyIds.includes(storyId),
    ),
  };
}

function findPerson(personId) {
  return staticDb.people.find(person => person.id === personId);
}
