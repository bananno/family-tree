import React from 'react';

import NotationList from 'notation/components/NotationList';
import useNotationList from 'notation/hooks/useNotationList';

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
