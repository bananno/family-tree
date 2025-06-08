import React, { useState } from 'react';

import NotationsTable from 'notation/components/NotationsTable';
import useNotations from 'notation/hooks/useNotations';
import Filter from 'shared/Filter';
import Button from 'shared/form/Button';

const filterId = 'NOTATIONS-INDEX';

export default function NotationIndexPage() {
  const [expandAll, setExpandAll] = useState(false);
  const { notations } = useNotations({ filterId, fullContent: expandAll });

  return (
    <div>
      <h2>notations</h2>
      {!expandAll && (
        <Button onClick={() => setExpandAll(true)}>Expand all</Button>
      )}
      <Filter filterId={filterId} />
      <NotationsTable notations={notations} />
    </div>
  );
}
