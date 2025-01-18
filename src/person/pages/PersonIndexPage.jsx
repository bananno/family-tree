import React, { useState } from 'react';

import PersonList from 'person/components/PersonList';
import usePersonList from 'person/hooks/usePersonList';
import Filter from 'shared/Filter';

export default function PersonIndexPage() {
  const [filterWords, setFilterWords] = useState([]);
  const { people, isLoading } = usePersonList({ filterWords });

  return (
    <>
      <h1>People</h1>
      <Filter onChange={setFilterWords} />
      {isLoading && <p>loading...</p>}
      <PersonList people={people} />
    </>
  );
}
