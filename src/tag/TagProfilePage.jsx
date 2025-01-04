import React from 'react';
import { useParams } from 'react-router-dom';

import BulletList from 'shared/BulletList';
import NotationList from 'notation/NotationList';
import PersonList from 'person/components/PersonList';
import SourceList from 'source/SourceList';
import StoryList from 'story/StoryList';
import TagList from 'tag/TagList';
import TagDetails from 'tag/TagDetails';
import TagNumberOfChildrenPage from 'tag/TagNumberOfChildrenPage';
import useTagProfile from '../hooks/useTagProfile';

export default function TagProfilePage() {
  const { tagId } = useParams();
  const { tag } = useTagProfile({ tagId });

  // TO DO: handle this in the routes later
  if (tag.title === 'number of children') {
    return <TagNumberOfChildrenPage tag={tag} />;
  }

  return (
    <>
      <TagDetails tag={tag} />
      <hr />
      <h1>items with tag</h1>
      <EventsWithTag tag={tag} />
      <ImagesWithTag tag={tag} />
      {tag.attachedItems?.notations?.length && (
        <>
          <h2>notations</h2>
          <NotationList notations={tag.attachedItems?.notations || []} />
        </>
      )}
      <PeopleWithTag tag={tag} />
      {tag.attachedItems?.sources?.length && (
        <>
          <h2>sources</h2>
          <SourceList sources={tag.attachedItems?.sources || []} />
        </>
      )}
      {tag.attachedItems?.stories?.length && (
        <>
          <h2>stories</h2>
          <StoryList stories={tag.attachedItems?.stories || []} />
        </>
      )}
      <TagsWithTag tag={tag} />
    </>
  );
}

////////////////////

function EventsWithTag({ tag }) {
  if (!tag.attachedItems?.events?.length) {
    return null;
  }
  // TO DO: EventList and EventLink
  return (
    <>
      <h2>events</h2>
      <BulletList>
        {tag.attachedItems.events.map(event => (
          <li key={event.id}>{event.title}</li>
        ))}
      </BulletList>
    </>
  );
}

function ImagesWithTag({ tag }) {
  if (!tag.attachedItems?.images?.length) {
    return null;
  }
  // TO DO: ImageList of some sort?
  return (
    <>
      <h2>images</h2>
      <BulletList>
        {tag.attachedItems.images.map(image => (
          <li key={image.id}>{image.id}</li>
        ))}
      </BulletList>
    </>
  );
}

// TO DO: clean this up. add grouping option to other models too
function PeopleWithTag({ tag }) {
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
            <PersonList people={valueMap[tagValue]} />
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
      <PersonList people={peopleWithTag} showTagValues={showTagValues} />
      {tag.showMissingItems && (
        <>
          <h2>people without tag</h2>
          <PersonList people={[]} />
        </>
      )}
    </>
  );
}

function TagsWithTag({ tag }) {
  if (!tag.attachedItems?.tags?.length) {
    return null;
  }
  return (
    <>
      <h2>tags</h2>
      <TagList tags={tag.attachedItems.tags} showValues={false} />
    </>
  );
}
