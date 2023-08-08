import {useState, useEffect} from 'react';

function useSourceProfile({sourceId}) {
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:9000/api/source-profile/${sourceId}`)
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
  }, []);

  return {source: response, isLoading};
}

export default useSourceProfile;
