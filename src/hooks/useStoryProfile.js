import {useState, useEffect} from 'react';

import {useStaticDb} from '../SETTINGS';
import staticDb from '../database/staticDb';

function useStoryProfile({storyId}) {
  const [response, setResponse] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (useStaticDb) {
      setResponse(getStaticResponse(storyId));
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    fetch(`http://localhost:9000/api/story-profile/${storyId}`)
      .then((res) => res.json())
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        console.log('ERROR', err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [storyId]);

  return {story: response, isLoading};
}

function getStaticResponse(storyId) {
  const story = staticDb.stories.find(story => story.id === storyId);
  return {
    ...story,
    people: story.personIds.map(findPerson),
    entries: staticDb.sources.filter(source => source.storyId === storyId),
    nonEntrySources: staticDb.sources.filter(source => source.storyIds.includes(storyId)),
  };
}

function findPerson(personId) {
  return staticDb.people.find(person => person.id === personId);
}

export default useStoryProfile;
