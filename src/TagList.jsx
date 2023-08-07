import React from 'react';

function TagList({tags}) {
  // String(value) because otherwise booleans don't display
  return (
    <ul>
      {tags.map(tag => (
        <li key={tag.id}>
          {tag.title}: {String(tag.value)}
        </li>
      ))}
    </ul>
  );
}

export default TagList;
