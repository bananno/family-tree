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
      <hr/>
      <h1>items with tag</h1>
      <EventsWithTag tag={tag}/>
      <ImagesWithTag tag={tag}/>
      {tag.attachedItems?.notations?.length && (
        <>
          <h2>notations</h2>
          <NotationList notations={tag.attachedItems?.notations || []}/>
        </>
      )}
      <PeopleWithTag tag={tag}/>
      {tag.attachedItems?.sources?.length && (
        <>
          <h2>sources</h2>
          <SourceList sources={tag.attachedItems?.sources || []}/>
        </>
      )}
      {tag.attachedItems?.stories?.length && (
        <>
          <h2>stories</h2>
          <StoryList stories={tag.attachedItems?.stories || []}/>
        </>
      )}
      <TagsWithTag tag={tag}/>
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

const EventsWithTag = ({tag}) => {
  if (!tag.attachedItems?.events?.length) {
    return null;
  }
  // TO DO: EventList and EventLink
  return (
    <>
      <h2>events</h2>
      <ul>
        {
          tag.attachedItems.events.map(event => (
            <li key={event.id}>{event.title}</li>
          ))
        }
      </ul>
    </>
  );
};

const ImagesWithTag = ({tag}) => {
  if (!tag.attachedItems?.images?.length) {
    return null;
  }
  // TO DO: ImageList of some sort?
  return (
    <>
      <h2>images</h2>
      <ul>
        {
          tag.attachedItems.images.map(image => (
            <li key={image.id}>{image.id}</li>
          ))
        }
      </ul>
    </>
  );
};

// TO DO: clean this up. add grouping option to other models too
const PeopleWithTag = ({tag}) => {
  const peopleWithTag = tag.attachedItems?.people || [];

  if (tag.groupByValue) {
    let valueMap = {};
    peopleWithTag.forEach(person => {
      person.tagValue.split(',').forEach(tagValue => {
        if (!valueMap[tagValue]) {
          valueMap[tagValue] = [];
        }
        valueMap[tagValue].push(person);
      });
    });
    const valueList = Object.keys(valueMap).sort();

    return (
      <>
        <h2>people</h2>
        {valueList.map(tagValue => (
          <div key={tagValue}>
            <h4>{tagValue}</h4>
            <PersonList people={valueMap[tagValue]}/>
          </div>
        ))}
      </>
    );
  }

  if (!peopleWithTag.length && !tag.showMissingItems) {
    return null;
  }

  const showTagValues = tag.valueType !== 0;

  return (
    <>
      <h2>people {tag.showMissingItems && 'with tag'}</h2>
      <PersonList people={peopleWithTag} showTagValues={showTagValues}/>
      {tag.showMissingItems && (
        <>
          <h2>people without tag</h2>
          <PersonList people={[]}/>
        </>
      )}
    </>
  );
};

const TagsWithTag = ({tag}) => {
  if (!tag.attachedItems?.tags?.length) {
    return null;
  }
  return (
    <>
      <h2>tags</h2>
      <TagList tags={tag.attachedItems.tags} showValues={false}/>
    </>
  );
};

export default TagProfilePage;
