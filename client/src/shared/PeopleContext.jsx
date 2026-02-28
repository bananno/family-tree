import React, { createContext, useContext, useEffect, useState } from 'react';

import api from 'shared/api';

const PeopleContext = createContext();

export function PeopleProvider({ children }) {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchPeople() {
    setLoading(true);
    const { result } = await api('people');
    setPeople(result?.items || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchPeople();
  }, []);

  const value = {
    people,
    loading,
    refetch: fetchPeople,
  };

  return (
    <PeopleContext.Provider value={value}>{children}</PeopleContext.Provider>
  );
}

export function usePeopleContext() {
  return useContext(PeopleContext);
}
