import React from 'react';

import NotationList from 'notation/components/NotationList';
import useNotationList from 'notation/hooks/useNotationList';

export default function NotationIndexPage() {
  const { notations } = useNotationList();

  return (
    <div>
      <h2>notations</h2>
      <NotationList notations={notations} />
    </div>
  );
}
