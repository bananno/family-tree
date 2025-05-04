import React from 'react';
import { Link } from 'react-router-dom';

import BulletList from 'shared/BulletList';
import TagList from 'tag/components/TagList';

export default function TagDetails({ tag, specialView }) {
  return (
    <>
      <h1>
        <i>{specialView ? 'special tag view' : 'tag'}:</i> {tag.title}
      </h1>
      <Link to={`http://localhost:9000/tag/${tag.id}`}>old version</Link>
      <h2 style={{ margin: '10px 0' }}>definition</h2>
      {tag.definition?.length ? (
        tag.definition.map((text, i) => <p key={i}>{text}</p>)
      ) : (
        <p>(none)</p>
      )}
      <h2 style={{ margin: '10px 0' }}>category</h2>
      <p>{tag.category || '(none)'}</p>
      <h2 style={{ margin: '10px 0' }}>value type</h2>
      <p>
        {tag.valueType} - {tag.valueTypeName}
      </p>
      <h2 style={{ margin: '10px 0' }}>value options</h2>
      {tag.valueType === 2 ? (
        <BulletList>
          {tag.valueOptions?.map(option => (
            <li key={option}>{option}</li>
          ))}
        </BulletList>
      ) : (
        <p>(not applicable)</p>
      )}
      <h2 style={{ margin: '10px 0' }}>model types</h2>
      <TagProfileModelTypesAllowed tag={tag} />
      <h2 style={{ margin: '10px 0' }}>metatags</h2>
      <TagList tags={tag.tags} />
      {tag.tags?.length === 0 && <p>(none)</p>}
    </>
  );
}

////////////////////

function TagProfileModelTypesAllowed({ tag }) {
  if (tag.restrictedToModels?.length > 0) {
    return (
      <>
        <p>restricted to these models only:</p>
        <BulletList>
          {tag.restrictedToModels.map(modelName => (
            <li key={modelName}>{modelName}</li>
          ))}
        </BulletList>
      </>
    );
  }
  return <p>all models allowed</p>;
}
