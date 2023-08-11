import {useState, useEffect} from 'react';

function useStoryList({storyType}) {
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const requestUrl = storyType === 'nonEntrySources'
    ? 'http://localhost:9000/api/story-non-entry-source'
    : storyType
    ? `http://localhost:9000/api/story-index/${storyType}`
    : 'http://localhost:9000/api/story-index';

  useEffect(() => {
    fetch(requestUrl)
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
  }, [storyType]);

  return {stories: response, isLoading};
}

export default useStoryList;
