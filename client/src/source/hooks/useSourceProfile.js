import { useState, useEffect } from 'react';

import useSessionContext from 'session/useSessionContext';
import api from 'shared/api';

export default function useSourceProfile({ sourceId }) {
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState(null);
  const { currentUser } = useSessionContext();

  async function fetchSource() {
    const { result } = await api(`api/source-profile/${sourceId}`);
    setSource(result?.data);
    setLoading(false);
  }

  useEffect(() => {
    setSource(null);
    setLoading(true);
    fetchSource();
  }, [currentUser, sourceId]);

  return { loading, source };
}
