import {useState, useEffect} from 'react';

function useTagProfile({tagId}) {
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:9000/api/tag-profile/${tagId}`)
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
  }, [tagId]);

  return {tag: response, isLoading};
}

export default useTagProfile;
