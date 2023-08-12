import React from 'react';
import {useParams} from 'react-router-dom';

import useTagProfile from '../hooks/useTagProfile';

const TagProfilePage = () => {
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
      <p>{tag.valueType} - {tag.valueTypeName}</p>
      <h2>value options</h2>
      <p>(TO DO)</p>
      <h2>model types</h2>
      <TagProfileModelTypesAllowed tag={tag}/>
      <hr/>
      <h1>items with tag</h1>
      <h2>people</h2>
    </>
  );
};

const TagProfileModelTypesAllowed = ({tag}) => {
  if (tag.restrictedToModels?.length > 0) {
    return (
      <>
        <p>restricted to these models only:</p>
        <ul>
          {tag.restrictedToModels.map(modelName => (
            <li key={modelName}>{modelName}</li>
          ))}
        </ul>
      </>
    )
  }
  return <p>all models allowed</p>;
};

export default TagProfilePage;
