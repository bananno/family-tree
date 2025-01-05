import React from 'react';

import CheckFalseImg from './check-false.png';
import CheckTrueImg from './check-true.png';
import classes from './Checkmark.module.scss';

export default function Checkmark({ value }) {
  const imgSrc = value ? CheckTrueImg : CheckFalseImg;
  return <img src={imgSrc} className={classes.Checkmark} />;
}
