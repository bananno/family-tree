import React from 'react';
import PersonLink from './PersonLink';

function PersonList({people}) {
  return (
    <ul>
      {people.map(person => (
        <li key={person.id}>
          <PersonLink person={person}/>
        </li>
      ))}
    </ul>
  );
}

export default PersonList;
