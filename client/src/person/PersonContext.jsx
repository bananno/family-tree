import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import useSessionContext from 'session/useSessionContext';
import api from 'shared/api';

export const PersonContext = createContext();

export function PersonProvider({ children }) {
  const { id: personId } = useParams();
  const { currentUser } = useSessionContext();

  const [loading, setLoading] = useState(true);
  const [notAuthorized, setNotAuthorized] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [person, setPerson] = useState(null);

  async function fetchPerson() {
    setLoading(true);

    const { notAuthorized, notFound, result } = await api(`people/${personId}`);

    setNotAuthorized(notAuthorized || false);
    setNotFound(notFound || false);
    setPerson(!notFound && !notAuthorized ? result : null);
    setLoading(false);
  }

  useEffect(() => {
    // Reset response to avoid an awkward mix of old and loading data.
    setPerson(null);
    setNotAuthorized(false);
    setLoading(true);
    setNotFound(false);

    fetchPerson();
  }, [currentUser, personId]);

  const value = {
    loading,
    notAuthorized,
    notFound,
    person,
    personId,
    refetch: fetchPerson,
  };

  return (
    <PersonContext.Provider value={value}>{children}</PersonContext.Provider>
  );
}

export function usePersonContext() {
  return useContext(PersonContext);
}
