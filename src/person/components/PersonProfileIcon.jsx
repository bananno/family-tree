import React from 'react';

import classes from './PersonProfileIcon.module.scss';

export default function PersonProfileIcon({
  person,
  large = false,
  square = false,
}) {
  const classNames = [classes.PersonProfileIcon];

  if (large) {
    classNames.push(classes.large);
  }

  if (square) {
    classNames.push(classes.square);
  }

  if (person.gender === 'male' || person.gender === 'female') {
    classNames.push(classes[`${person.gender}Placeholder`]);
  } else {
    classNames.push(classes.genericPlaceholder);
  }

  if (!person?.profileImage) {
    return <div className={classNames.join(' ')} />;
  }

  return (
    <img
      src={person.profileImage}
      alt={person.name}
      className={classNames.join(' ')}
    />
  );
}
