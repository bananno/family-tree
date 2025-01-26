import React from 'react';

import classes from './PersonProfileIcon.module.scss';

// Pass either a person (to use their default profile image) or a
// src (to use a custom image)
export default function PersonProfileIcon({
  person,
  src,
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

  const imageUrl = src || person?.profileImage;

  if (!imageUrl) {
    return <div className={classNames.join(' ')} style={style} />;
  }

  return (
    <img
      src={imageUrl}
      alt={person?.name}
      className={classNames.join(' ')}
      style={style}
    />
  );
}
