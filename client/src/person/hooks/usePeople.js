import { useState, useEffect } from 'react';

import useSessionContext from 'session/useSessionContext';
import api from 'shared/api';
import { useFilter } from 'shared/FilterContext';

export default function usePeople({ filterId }) {
  const { currentUser } = useSessionContext();
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getFilteredList } = useFilter();

  async function fetchPeople() {
    setLoading(true);
    const { result } = await api('people');
    setPeople(result?.items || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchPeople();
  }, [currentUser]);

  const filteredPeople = getFilteredList(
    filterId,
    people,
    person => person.name,
  );

  return { people: filteredPeople, loading };
}
