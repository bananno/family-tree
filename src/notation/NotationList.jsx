import React from 'react';

import BulletList from '../shared/BulletList';

import NotationLink from './NotationLink';

export default function NotationList({notations}) {
  return (
    <BulletList>
      {notations.map(notation => (
        <li key={notation.id}>
          <NotationLink notation={notation}/>
        </li>
      ))}
    </BulletList>
  );
}
