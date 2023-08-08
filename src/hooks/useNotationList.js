import {useState, useEffect} from 'react';

function useNotationList() {
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:9000/api/notation-index')
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

  return {notations: response, isLoading};
}

export default useNotationList;
