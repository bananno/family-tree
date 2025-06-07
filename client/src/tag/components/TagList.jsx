import React from 'react';

import BulletList from 'shared/BulletList';
import TagItem from 'tag/components/TagItem';

export default function TagList({ tags = [], showDefinitions, showValues }) {
  // In production, tags are an object instead of an array.
  // There is a small window when switching from production to development
  // where the tags are still an object, but the TagList is expecting an array.
  if (!Array.isArray(tags)) {
    return null;
  }
  return (
    <BulletList>
      {tags.map(tag => (
        <li key={tag.id}>
          <TagItem {...{ tag, showDefinitions, showValues }} />
        </li>
      ))}
    </BulletList>
  );
}
