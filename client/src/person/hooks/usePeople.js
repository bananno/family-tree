import { pick } from 'lodash';
import { useState, useEffect } from 'react';

import staticPeople from 'db/people.json';
import api from 'shared/api';
import { useFilter } from 'shared/FilterContext';
import useEnvironment from 'shared/useEnvironment';

export default function usePeople({ filterId }) {
  const { isDevelopment, isProduction } = useEnvironment();
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getFilteredList } = useFilter();

  function getStaticPeople() {
    setResponse(getStaticResponse());
    setIsLoading(false);
  }

  async function fetchFullPeople() {
    setIsLoading(true);
    const { result } = await api('people', { catchPlease: true });
    setResponse(result);
    setIsLoading(false);
  }

  const fetchPeople = isProduction
    ? getStaticPeople
    : isDevelopment
      ? fetchFullPeople
      : () => {};

  useEffect(() => {
    fetchPeople();
  }, [isDevelopment, isProduction]);

  const allPeople = response.items || [];

  const filteredPeople = getFilteredList(
    filterId,
    allPeople,
    person => person.name,
  );

  return { people: filteredPeople, isLoading };
}

////////////////////

function getStaticResponse() {
  return {
    items: staticPeople.map(person =>
      pick(person, ['id', 'name', 'avatarUrl', 'gender']),
    ),
  };
}
