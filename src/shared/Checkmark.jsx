import React from 'react';

import CheckTrueImg from './check-true.png';
import CheckFalseImg from './check-false.png';
import classes from './Checkmark.module.scss';

const Checkmark = ({value}) => {
  const imgSrc = value ? CheckTrueImg : CheckFalseImg;
  return <img src={imgSrc} className={classes.Checkmark}/>;
};

export default Checkmark;
