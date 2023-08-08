import React from 'react';

import NotationLink from './NotationLink';
import useNotationList from '../hooks/useNotationList';

function NotationsPage() {
  const {notations} = useNotationList();

  return (
    <div>
      <h2>notations</h2>
      <ul>
        {notations.map(notation => (
          <li key={notation.id}>
            <NotationLink notation={notation}/>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotationsPage;
