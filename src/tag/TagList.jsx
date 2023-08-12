import React from 'react';

import TagLink from './TagLink';

function TagList({tags}) {
  // String(value) because otherwise booleans don't display
  return (
    <ul>
      {tags.map(tag => (
        <li key={tag.id}>
          <TagLink tag={tag}/>: {String(tag.value)}
        </li>
      ))}
    </ul>
  );
}

export default TagList;
