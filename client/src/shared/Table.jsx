import React from 'react';

import classes from './Table.module.scss';

export default function Table({ children }) {
  return <table className={classes.Table}>{children}</table>;
}
