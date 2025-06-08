import React from 'react';

import { usePersonContext } from 'person/PersonContext';
import TagsWorkflow from 'tag/TagsWorkflow';

export default function PersonTagsPage() {
  const { person, personId, refetch } = usePersonContext();

  return (
    <TagsWorkflow
      editTagRoutePath={`people/${personId}/tags`}
      modelName="people"
      refetch={refetch}
      tags={person.tags}
    />
  );
}
