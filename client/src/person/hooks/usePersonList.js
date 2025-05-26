import { pick } from 'lodash';
import { useState, useEffect } from 'react';

import staticPeople from 'db/people.json';
import api from 'shared/api';
import { useFilter } from 'shared/FilterContext';
import useEnvironment from 'shared/useEnvironment';

export default function usePersonList({ filterId }) {
  const { isProduction } = useEnvironment();
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getFilteredList } = useFilter();

  useEffect(() => {
    fetchPeople();
  }, [isProduction]);

  async function fetchPeople() {
    if (isProduction) {
      setResponse(getStaticResponse());
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const { result } = await api('api/person-index', { catchPlease: true });
    setResponse(result.data || []);
    setIsLoading(false);
  }

  const allPeople = response || [];

  const filteredPeople = getFilteredList(
    filterId,
    allPeople,
    person => person.name,
  );

  return { people: filteredPeople, isLoading };
}

////////////////////

function getStaticResponse() {
  return staticPeople.map(person =>
    pick(person, ['id', 'name', 'profileImage', 'gender']),
  );
}
