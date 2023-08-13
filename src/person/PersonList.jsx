import React from 'react';

import PersonLink from './PersonLink';
import globalClasses from '../Global.module.scss';

function PersonList({people=[], showTagValues, getNote, columns}) {
  // TO DO: dynamic columns
  if (columns === 2) {
    const halfway = Math.ceil(people.length / 2);
    const people1 = people.slice(0, halfway);
    const people2 = people.slice(halfway);
    const props = {showTagValues, getNote};
    return (
      <>
        <div className={globalClasses.column}>
          <PersonList people={people1} {...props} />
        </div>
        <div className={globalClasses.column}>
          <PersonList people={people2} {...props} />
        </div>
      </>
    );
  }
  return (
    <ul>
      {people.map(person => (
        <li key={person.id}>
          <PersonLink person={person}/>
          {showTagValues && ` - ${person.tagValue}`}
          {getNote && ` ${getNote(person)}`}
        </li>
      ))}
    </ul>
  );
}

export default PersonList;
