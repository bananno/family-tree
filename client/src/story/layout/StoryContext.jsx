import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import useSessionContext from 'session/useSessionContext';
import api from 'shared/api';

export const StoryContext = createContext();

export function StoryProvider({ children }) {
  const { id: storyId } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notAuthorized, setNotAuthorized] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { currentUser } = useSessionContext();

  async function fetchStory() {
    setLoading(true);

    const { notAuthorized, notFound, result } = await api(`stories/${storyId}`);

    setNotFound(notFound || false);
    setNotAuthorized(notAuthorized || false);
    setStory(result || null);
    setLoading(false);
  }

  useEffect(() => {
    setStory(null);
    setLoading(true);
    setNotFound(false);
    setNotAuthorized(false);
    fetchStory();
  }, [currentUser, storyId]);

  const value = {
    loading,
    notAuthorized,
    notFound,
    story,
    refetch: fetchStory,
  };

  return (
    <StoryContext.Provider value={value}>{children}</StoryContext.Provider>
  );
}
