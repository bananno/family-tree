import React from 'react';

import BulletList from 'shared/BulletList';
import TagLink from 'tag/components/TagLink';

export default function TagList({
  tags = [],
  showDefinitions,
  showValues = true,
}) {
  // In production, tags are an object instead of an array.
  // There is a small window when switching from production to development
  // where the tags are still an object, but the TagList is expecting an array.
  if (!Array.isArray(tags)) {
    return null;
  }
  if (showValues) {
    // String(value) because otherwise booleans don't display
    return (
      <BulletList>
        {tags.map(tag => (
          <li key={tag.id}>
            <TagLink tag={tag} />: {String(tag.value)}
          </li>
        ))}
      </BulletList>
    );
  }
  if (showDefinitions) {
    return (
      <BulletList>
        {tags.map(tag => (
          <li key={tag.id}>
            <TagLink tag={tag} /> - {tag.definition}
          </li>
        ))}
      </BulletList>
    );
  }
  return (
    <BulletList>
      {tags.map(tag => (
        <li key={tag.id}>
          <TagLink tag={tag} />
        </li>
      ))}
    </BulletList>
  );
}
