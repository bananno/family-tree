import React from 'react';
import PersonLink from './PersonLink';

function PersonList({people, showTagValues}) {
  return (
    <ul>
      {people.map(person => (
        <li key={person.id}>
          <PersonLink person={person}/>
          {showTagValues && ` - ${person.tagValue}`}
        </li>
      ))}
    </ul>
  );
}

export default PersonList;
