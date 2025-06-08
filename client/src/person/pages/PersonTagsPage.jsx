import React from 'react';

import { usePersonContext } from 'person/PersonContext';
import TagAttachments from 'tag/TagAttachments';

export default function PersonTagsPage() {
  const { person, refetch } = usePersonContext();

  return (
    <TagAttachments modelName="Person" subject={person} refetch={refetch} />
  );
}
