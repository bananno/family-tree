import React from 'react';

import NotationLink from './NotationLink';

function NotationList({notations}) {
  return (
    <ul>
      {notations.map(notation => (
        <li key={notation.id}>
          <NotationLink notation={notation}/>
        </li>
      ))}
    </ul>
  );
}

export default NotationList;
