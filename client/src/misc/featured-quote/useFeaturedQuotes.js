import { useEffect, useState } from 'react';

import useSessionContext from 'session/useSessionContext';
import api from 'shared/api';

// Get the list of featured quotes for the featured quotes page.
export function useFeaturedQuotes() {
  const { currentUser } = useSessionContext();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchQuotes() {
    setLoading(true);
    const { result } = await api('/featured-quotes');
    setQuotes(result?.items || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchQuotes();
  }, [currentUser]);

  return { quotes, loading, refetch: fetchQuotes };
}
