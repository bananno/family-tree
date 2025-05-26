import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import api from 'shared/api';

export const TagContext = createContext();

export function TagProvider({ children }) {
  const { id: tagId } = useParams();
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetchTag();
  }, [tagId]);

  async function fetchTag() {
    setLoading(true);
    const { notFound, result } = await api(`tags/${tagId}`, { catchPlease: true });
    setResponse(result.data || {});
    setLoading(false);
    setNotFound(notFound || false);
  }

  const value = {
    loading,
    notFound,
    tag: response,
    tagId,
    refetch: fetchTag,
  };

  return <TagContext.Provider value={value}>{children}</TagContext.Provider>;
}

export function useTagContext() {
  return useContext(TagContext);
}
