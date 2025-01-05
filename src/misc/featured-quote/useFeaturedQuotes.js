import { useEffect, useState } from 'react';

const API_URL = 'http://localhost:9000';

// Get the list of featured quotes for the featured quotes page.
export function useFeaturedQuotes() {
  const [quotes, setQuotes] = useState([]);

  function fetchQuotes() {
    fetch(`${API_URL}/featured-quotes`)
      .then(res => res.json())
      .then(res => {
        setQuotes(res.data);
      })
      .catch(err => {
        console.log('ERROR', err.message);
      });
  }

  useEffect(() => {
    fetchQuotes();
  }, []);

  return { quotes, refetch: fetchQuotes };
}
