import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
      <p>
        <Link to="http://localhost:9000/notations">
          new notation (old site)
        </Link>
      </p>
      {!expandAll && (
        <Button onClick={() => setExpandAll(true)}>Expand all</Button>
      )}
      <Filter filterId={filterId} />
      <NotationsTable notations={notations} />
    </div>
  );
}
