import { pick } from 'lodash';
import { useState, useEffect } from 'react';

import staticPeople from 'db/people.json';
import { useFilter } from 'shared/FilterContext';
import useEnvironment from 'shared/useEnvironment';

export default function usePersonList({ filterId }) {
  const { isProduction } = useEnvironment();
  const [response, setResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getFilteredList } = useFilter();

  useEffect(() => {
    if (isProduction) {
      setResponse(getStaticResponse());
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    fetch('http://localhost:9000/api/person-index')
      .then(res => res.json())
      .then(res => {
        setResponse(res.data);
      })
      .catch(err => {
        console.log('ERROR', err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [isProduction]);

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
