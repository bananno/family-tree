import React from 'react';
import {Link} from 'react-router-dom';

function PersonLink({person}) {
  const personProfileUrl = `/person/${person.id}`;
  return (
    <Link to={personProfileUrl}>{person.name}</Link>
  );
}

export default PersonLink;
