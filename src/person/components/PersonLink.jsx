import React from 'react';
import { Link } from 'react-router-dom';

import PersonProfileIcon from './PersonProfileIcon';

export default function PersonLink({ person }) {
  const personProfileUrl = `/person/${person.id}`;
  return (
    <Link to={personProfileUrl}>
      <PersonProfileIcon person={person} style={{ marginRight: '5px' }} />
      {person.name}
    </Link>
  );
}
