import React from 'react';

import classes from './BulletList.module.scss';

export default function BulletList({ children }) {
  return (
    <ul className={classes.BulletList}>
      {children}
    </ul>
  );
}
