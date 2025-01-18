import React, { useState } from 'react';

import NewPersonModal from 'person/components/NewPersonModal';
import PersonList from 'person/components/PersonList';
import usePersonList from 'person/hooks/usePersonList';
import DevOnly from 'shared/DevOnly';
import Filter from 'shared/Filter';

export default function PersonIndexPage() {
  const [filterWords, setFilterWords] = useState([]);
  const { people, isLoading } = usePersonList({ filterWords });

  return (
    <>
      <h1>People</h1>
      <DevOnly>
        <NewPersonModal />
        <br />
      </DevOnly>
      <Filter onChange={setFilterWords} />
      {isLoading && <p>loading...</p>}
      <PersonList people={people} />
    </>
  );
}
