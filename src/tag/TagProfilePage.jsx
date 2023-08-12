import React from 'react';
import {useParams} from 'react-router-dom';

import useTagProfile from '../hooks/useTagProfile';

function TagProfilePage() {
  const {tagId} = useParams();
  const {tag} = useTagProfile({tagId});

  return (
    <>
      <h1><i>tag:</i> {tag.title}</h1>
      <h2>definition</h2>
      <p>{tag.definition || '(none)'}</p>
      <h2>category</h2>
      <p>{tag.category || '(none)'}</p>
      <h2>value type</h2>
      <p>{tag.valueType}</p>
      <h2>value options</h2>
      <p>(TO DO)</p>
      <hr/>
      <h1>items with tag</h1>
      <h2>people</h2>
    </>
  );
}

export default TagProfilePage;
