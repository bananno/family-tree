import React from 'react';

import NotationList from './NotationList';
import useNotationList from '../hooks/useNotationList';

function NotationsPage() {
  const {notations} = useNotationList();

  return (
    <div>
      <h2>notations</h2>
      <NotationList notations={notations}/>
    </div>
  );
}

export default NotationsPage;
