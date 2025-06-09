import React from 'react';

import NewPersonModal from 'person/components/NewPersonModal';
import PeopleTable from 'person/components/PeopleTable';
import PersonList from 'person/components/PersonList';
import usePeople from 'person/hooks/usePeople';
import DevOnly from 'shared/DevOnly';
import Filter from 'shared/Filter';
import Spacer from 'shared/Spacer';
import useEnvironment from 'shared/useEnvironment';

const filterId = 'FILTER_PEOPLE_PAGE_TABLE';

export default function PeopleIndexPage() {
  const { people, isLoading } = usePeople({ filterId });
  const { isDevelopment } = useEnvironment();

  return (
    <>
      <h1>People</h1>
      <DevOnly>
        <NewPersonModal />
        <Spacer />
      </DevOnly>
      <Filter filterId={filterId} />
      {isLoading && <p>loading...</p>}
      {isDevelopment ? (
        <PeopleTable people={people} />
      ) : (
        <PersonList people={people} />
      )}
    </>
  );
}
