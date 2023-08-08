import React from 'react';

import PersonList from './PersonList';
import usePersonList from '../hooks/usePersonList';

function PeoplePage() {
  const {people, isLoading} = usePersonList();

  return (
    <div>
      <h2>people</h2>
      {isLoading && <p>loading...</p>}
      <PersonList people={people}/>
    </div>
  );
}

export default PeoplePage;

