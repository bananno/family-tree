import {useState, useEffect} from 'react';

function useNotationProfile({notationId}) {
  const [response, setResponse] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:9000/api/notation-profile/${notationId}`)
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
  }, [notationId]);

  return {notation: response, isLoading};
}

export default useNotationProfile;
