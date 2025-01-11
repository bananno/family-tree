import React from 'react';
import { Link } from 'react-router-dom';

import PersonProfileIcon from 'person/components/PersonProfileIcon';
import classes from 'person/person.module.scss';

// alreadySelected = a boolean value that indicates this should not actually
// be a link; used for showing the person in their own sibling list.
export default function PersonLink({
  person,
  alreadySelected,
  small,
}) {
  const classNames = [classes.PersonLink];

  if (small) {
    classNames.push(classes.small);
  }

  if (alreadySelected) {
    return (
      <div className={[...classNames, classes.alreadySelected].join(' ')}>
        <PersonProfileIcon person={person} style={{ marginRight: '5px' }} />
        {person.name}
      </div>
    );
  }
  const personProfileUrl = `/person/${person.id}`;
  return (
    <Link to={personProfileUrl} className={classNames.join(' ')}>
      <PersonProfileIcon person={person} style={{ marginRight: '5px' }} />
      {person.name}
    </Link>
  );
}
