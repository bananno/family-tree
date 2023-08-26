import {useState, useEffect} from 'react';

function useSourceList({sourceType}) {
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const requestUrl = sourceType
    ? `http://localhost:9000/api/source-index/${sourceType}`
    : 'http://localhost:9000/api/source-index';

  useEffect(() => {
    setIsLoading(true);
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
  }, [sourceType]);

  return {sources: response, isLoading};
}

export default useSourceList;
