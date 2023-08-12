import React from 'react';

import TagLink from './TagLink';

function TagList({tags, showDefinitions, showValues=true}) {
  if (showValues) {
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
  if (showDefinitions) {
    return (
      <ul>
        {tags.map(tag => (
          <li key={tag.id}>
            <TagLink tag={tag}/> - {tag.definition}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul>
      {tags.map(tag => (
        <li key={tag.id}>
          <TagLink tag={tag}/>
        </li>
      ))}
    </ul>
  );
}

export default TagList;
