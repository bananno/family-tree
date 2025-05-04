import { useState, useEffect } from 'react';

import api from 'shared/api';

export default function useTag({ tagId }) {
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(true);

  async function fetchTag() {
    setLoading(true);
    const { result } = await api(`tags/${tagId}`, { catchPlease: true });
    setResponse(result.data || {});
    setLoading(false);
  }

  useEffect(() => {
    fetchTag();
  }, [tagId]);

  return { tag: response, loading, refetch: fetchTag };
}
