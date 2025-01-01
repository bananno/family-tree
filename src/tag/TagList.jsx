import React from 'react';

import BulletList from '../shared/BulletList';

import TagLink from './TagLink';

export default function TagList({
  tags = [],
  showDefinitions,
  showValues = true,
}) {
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
