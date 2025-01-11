import React from 'react';

import classes from './PersonProfileIcon.module.scss';

export default function PersonProfileIcon({
  person,
  large = false,
  medium = false,
  square = false,
  style = {},
}) {
  const classNames = [classes.PersonProfileIcon];

  if (large) {
    classNames.push(classes.large);
  }

  if (medium) {
    classNames.push(classes.medium);
  }

  if (square) {
    classNames.push(classes.square);
  }

  if (person?.gender === 'male' || person?.gender === 'female') {
    classNames.push(classes[`${person.gender}Placeholder`]);
  } else {
    classNames.push(classes.genericPlaceholder);
  }

  if (!person?.profileImage) {
    return <div className={classNames.join(' ')} style={style} />;
  }

  return (
    <img
      src={person.profileImage}
      alt={person.name}
      className={classNames.join(' ')}
      style={style}
    />
  );
}
