import {useState, useEffect} from 'react';

function useChecklistData(checklistTitle) {
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:9000/api/checklist/${checklistTitle}`)
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

  return {data: response, isLoading};
}

export default useChecklistData;
