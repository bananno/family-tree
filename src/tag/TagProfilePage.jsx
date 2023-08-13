import React from 'react';
import {useParams} from 'react-router-dom';

import NotationList from '../notation/NotationList';
import PersonList from '../person/PersonList';
import SourceList from '../source/SourceList';
import StoryList from '../story/StoryList';
import TagList from '../tag/TagList';
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
      {
        tag.valueType === 2
          ? <ul>{tag.valueOptions?.map(option => <li key={option}>{option}</li>)}</ul>
          : <p>(not applicable)</p>
      }
      <h2>model types</h2>
      <TagProfileModelTypesAllowed tag={tag}/>
      <hr/>
      <h1>items with tag</h1>
      <h2>events</h2>
      {/* TO DO: EventList and EventLink */}
      <ul>
        {
          tag.attachedItems?.events?.map(event => (
            <li key={event.id}>{event.title}</li>
          ))
        }
      </ul>
      <h2>images</h2>
      {/* TO DO: ImageList of some sort? */}
      <ul>
        {
          tag.attachedItems?.images?.map(image => (
            <li key={image.id}>{image.id}</li>
          ))
        }
      </ul>
      <h2>notations</h2>
      <NotationList notations={tag.attachedItems?.notations || []}/>
      <h2>people</h2>
      <PersonList people={tag.attachedItems?.people || []}/>
      <h2>sources</h2>
      <SourceList sources={tag.attachedItems?.sources || []}/>
      <h2>stories</h2>
      <StoryList stories={tag.attachedItems?.stories || []}/>
      <h2>tags</h2>
      <TagList tags={tag.attachedItems?.tags || []} showValues={false}/>
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
