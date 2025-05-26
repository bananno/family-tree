import React from 'react';

import NotationList from 'notation/components/NotationList';
import PersonList from 'person/components/PersonList';
import BulletList from 'shared/BulletList';
import Divider from 'shared/Divider';
import SourceList from 'source/components/SourceList';
import StoryList from 'story/components/StoryList';
import TagDetails from 'tag/components/TagDetails';
import TagList from 'tag/components/TagList';
import TagNumberOfChildrenPage from 'tag/pages/TagNumberOfChildrenPage';
import { useTagContext } from 'tag/TagContext';

export default function TagPage() {
  const { tag } = useTagContext();

  // TO DO: handle this in the routes later
  if (tag.title === 'number of children') {
    return <TagNumberOfChildrenPage />;
  }

  return (
    <>
      <TagDetails />
      <Divider />
      <h1>items with tag</h1>
      <EventsWithTag tag={tag} />
      <ImagesWithTag tag={tag} />
      {tag.attachedItems?.notation?.length > 0 && (
        <>
          <h2>notations</h2>
          <NotationList notations={tag.attachedItems.notation || []} />
        </>
      )}
      <PeopleWithTag tag={tag} />
      {tag.attachedItems?.source?.length > 0 && (
        <>
          <h2>sources</h2>
          <SourceList sources={tag.attachedItems.source || []} />
        </>
      )}
      {tag.attachedItems?.story?.length > 0 && (
        <>
          <h2>stories</h2>
          <StoryList stories={tag.attachedItems.story || []} />
        </>
      )}
      <TagsWithTag tag={tag} />
    </>
  );
}

////////////////////

function EventsWithTag({ tag }) {
  if (!tag.attachedItems?.event?.length) {
    return null;
  }
  // TO DO: EventList and EventLink
  return (
    <>
      <h2>events</h2>
      <BulletList>
        {tag.attachedItems.event.map(event => (
          <li key={event.id}>{event.title}</li>
        ))}
      </BulletList>
    </>
  );
}

function ImagesWithTag({ tag }) {
  if (!tag.attachedItems?.image?.length) {
    return null;
  }
  // TO DO: ImageList of some sort?
  return (
    <>
      <h2>images</h2>
      <BulletList>
        {tag.attachedItems.image.map(image => (
          <li key={image.id}>{image.id}</li>
        ))}
      </BulletList>
    </>
  );
}

// TO DO: clean this up. add grouping option to other models too
function PeopleWithTag({ tag }) {
  const peopleWithTag = tag.attachedItems?.person || [];

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
  if (!tag.attachedItems?.tag?.length) {
    return null;
  }
  return (
    <>
      <h2>tags</h2>
      <TagList tags={tag.attachedItems.tag} showValues={false} />
    </>
  );
}
