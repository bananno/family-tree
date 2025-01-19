import React from 'react';

import NotationLink from 'notation/components/NotationLink';
import BulletList from 'shared/BulletList';

export default function NotationList({ notations }) {
  return (
    <BulletList>
      {notations.map(notation => (
        <li key={notation.id}>
          <NotationLink notation={notation} />
        </li>
      ))}
    </BulletList>
  );
}
