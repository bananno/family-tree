import React from 'react';

import TagLink from 'tag/components/TagLink';

export default function TagItem({ tag, showDefinitions, showValues = true }) {
  if (showValues) {
    // String(value) because otherwise booleans don't display
    return (
      <>
        <TagLink tag={tag} />: {String(tag.value)}
      </>
    );
  }
  if (showDefinitions) {
    return (
      <>
        <TagLink tag={tag} /> - {tag.definition}
      </>
    );
  }
  return <TagLink tag={tag} />;
}
