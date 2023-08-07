import React from 'react';
import PersonItem from './PersonItem';

function PeopleList({people}) {
  return (
    <ul>
      {people.map(person => (
        <li key={person.id}>
          <PersonItem person={person}/>
        </li>
      ))}
    </ul>
  );
}

export default PeopleList;

