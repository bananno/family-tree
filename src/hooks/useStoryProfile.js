import {useState, useEffect} from 'react';

function useStoryProfile({storyId}) {
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

export default useStoryProfile;
