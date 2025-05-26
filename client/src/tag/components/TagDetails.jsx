import React from 'react';
import { Link } from 'react-router-dom';

import BulletList from 'shared/BulletList';
import DeleteTagModal from 'tag/components/DeleteTagModal';
import EditTagModal from 'tag/components/EditTagModal';
import TagList from 'tag/components/TagList';
import { useTagContext } from 'tag/TagContext';

export default function TagDetails({ specialView = false }) {
  const { tag, wasDeleted } = useTagContext();

  const definitionParts = tag.definition?.split('\n') || [];

  return (
    <>
      <h1>
        <i>{specialView ? 'special tag view' : 'tag'}:</i> {tag.title}
        {wasDeleted && <span style={{ color: 'red' }}> (deleted)</span>}
      </h1>
      {!wasDeleted && (
        <>
          <Link to={`http://localhost:9000/tag/${tag.id}`}>old version</Link>
          <br />
          <EditTagModal />
          {tag.canDelete && <DeleteTagModal />}
        </>
      )}
      <h2 style={{ margin: '10px 0' }}>definition</h2>
      {definitionParts.length > 0 ? (
        definitionParts.map((text, i) => <p key={i}>{text}</p>)
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
