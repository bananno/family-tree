import React from 'react';

import { usePersonContext } from 'person/PersonContext';
import ModelTags from 'tag/ModelTags';

export default function PersonTagsPage() {
  const { person, personId, refetch } = usePersonContext();

  return (
    <ModelTags
      editTagRoutePath={`people/${personId}/tags`}
      modelName="people"
      refetch={refetch}
      tags={person.tags}
    />
  );
}
