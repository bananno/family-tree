import React from 'react';

import NewPersonModal from 'person/components/NewPersonModal';
import PersonList from 'person/components/PersonList';
import usePeople from 'person/hooks/usePeople';
import DevOnly from 'shared/DevOnly';
import Filter from 'shared/Filter';

const filterId = 'FILTER_PEOPLE_PAGE_TABLE';

export default function PersonIndexPage() {
  const { people, isLoading } = usePeople({ filterId });

  return (
    <>
      <h1>People</h1>
      <DevOnly>
        <NewPersonModal />
        <br />
      </DevOnly>
      <Filter filterId={filterId} />
      {isLoading && <p>loading...</p>}
      <PersonList people={people} />
    </>
  );
}
