import {useState, useEffect} from 'react';

function usePersonList({personId}) {
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:9000/api/person-profile/${personId}`)
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
  }, [personId]);

  return {person: response, isLoading};
}

export default usePersonList;
