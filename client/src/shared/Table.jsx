import React from 'react';

import classes from './Table.module.scss';

export default function Table({ children }) {
  return <ul className={classes.Table}>{children}</ul>;
}
