import React from 'react';

import { usePersonContext } from 'person/PersonContext';
import TagList from 'tag/components/TagList';

export default function PersonTagsPage() {
  const { person } = usePersonContext();

  return (
    <>
      <h2>Tags</h2>
      <TagList tags={person.tags} />
    </>
  );
}
