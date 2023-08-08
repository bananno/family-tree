import React from 'react';

import useNotationList from './hooks/useNotationList';

function NotationsPage() {
  const {notations} = useNotationList();

  return (
    <div>
      <h2>notations</h2>
      <ul>
        {notations.map(notation => (
          <li key={notation.id}>
            {notation.title || '(empty)'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotationsPage;
