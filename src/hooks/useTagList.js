import {useState, useEffect} from 'react';

function useTagList({displayType} = {}) {
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const requestUrl = displayType
    ? `http://localhost:9000/api/tag-index/${displayType}`
    : 'http://localhost:9000/api/tag-index';

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
  }, [displayType]);

  return {tags: response, isLoading};
}

export default useTagList;
