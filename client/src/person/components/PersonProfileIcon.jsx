import clsx from 'clsx';
import React from 'react';

import profileFemale from '../../assets/profile-female.png';
import profileGeneric from '../../assets/profile-generic.png';
import profileMale from '../../assets/profile-male.png';

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
  const classNames = [
    'inline-block align-middle bg-cover border-solid border-gray-400',
  ];

  if (large) {
    // Person profile main icon
    classNames.push('w-40 h-40 border-2');
  } else if (medium) {
    // Person profile immediate family lists
    classNames.push('w-20 h-20 border-2');
  } else {
    // Standard size: most lists
    classNames.push('w-12 h-12 border');
  }

  if (square) {
    classNames.push('rounded-lg');
  } else {
    classNames.push('rounded-full');
  }

  let backgroundImage;
  if (person?.gender === 'female') {
    backgroundImage = `url(${profileFemale})`;
  } else if (person?.gender === 'male') {
    backgroundImage = `url(${profileMale})`;
  } else {
    backgroundImage = `url(${profileGeneric})`;
  }

  const fullStyles = {
    backgroundImage,
    ...style,
  };

  const imageUrl = src || person?.avatarUrl;

  if (!imageUrl) {
    return <div className={clsx(classNames)} style={fullStyles} />;
  }

  return (
    <img
      src={imageUrl}
      alt={person?.name}
      className={clsx(classNames)}
      style={fullStyles}
    />
  );
}
