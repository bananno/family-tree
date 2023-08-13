import React from 'react';

import TagList from '../tag/TagList';

const TagDetails = ({tag, specialView}) => {
  return (
    <>
      <h1>
        <i>{specialView ? 'special tag view': 'tag'}:</i> {tag.title}
      </h1>
      <h2>definition</h2>
      {
        tag.definition?.length
          ? tag.definition.map((text, i) => <p key={i}>{text}</p>)
          : <p>(none)</p>
      }
      <h2>category</h2>
      <p>{tag.category || '(none)'}</p>
      <h2>value type</h2>
      <p>{tag.valueType} - {tag.valueTypeName}</p>
      <h2>value options</h2>
      {
        tag.valueType === 2
          ? <ul>{tag.valueOptions?.map(option => <li key={option}>{option}</li>)}</ul>
          : <p>(not applicable)</p>
      }
      <h2>model types</h2>
      <TagProfileModelTypesAllowed tag={tag}/>
      <h2>metatags</h2>
      <TagList tags={tag.tags}/>
    </>
  );
}

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

export default TagDetails;
