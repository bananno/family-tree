import React from 'react';

import TagLink from 'tag/components/TagLink';

export default function TagItem({ tag, showDefinitions, showValues = true }) {
  if (showValues) {
    // String(value) because otherwise booleans don't display
    const value = String(tag.value);
    return (
      <>
        <TagLink tag={tag} />
        {value && `: ${value}`}
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
