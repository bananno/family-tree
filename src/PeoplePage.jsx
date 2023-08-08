import React from 'react';

import PeopleList from './PeopleList';
import usePersonList from './usePersonList';

function PeoplePage() {
  const {people, isLoading} = usePersonList();

  return (
    <div>
      <h2>people</h2>
      {isLoading && <p>loading...</p>}
      <PeopleList people={people}/>
    </div>
  );
}

export default PeoplePage;

