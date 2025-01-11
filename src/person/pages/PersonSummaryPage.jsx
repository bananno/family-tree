import React from 'react';

import PersonList from 'person/components/PersonList';
import PersonTree from 'person/components/PersonTree';
import { usePersonContext } from 'person/PersonContext';
import DevOnly from 'shared/DevOnly';
import TagList from 'tag/components/TagList';

// TODO: move share & tags to another page; add birth/death to top of this page

export default function PersonSummaryPage() {
  const { person } = usePersonContext();

  return (
    <>
      <DevOnly>
        <h3>share level</h3>
        {person.shareLevel}
        <h3>tags</h3>
        <TagList tags={person.tags} />
      </DevOnly>
      <hr />
      <PersonFamilySection title="parents" people={person.parents} />
      <PersonFamilySection
        title="siblings"
        people={person.siblings}
        showCurrent={person.id}
      />
      <PersonFamilySection title="spouses" people={person.spouses} />
      <PersonFamilySection title="children" people={person.children} />
      <hr />
      <h3>tree</h3>
      <PersonTree person={person} />
    </>
  );
}

////////////////////

function PersonFamilySection({ title, people, showCurrent }) {
  if (people.length === 0) {
    return null;
  }
  // This is the siblings list, but the current person is the only one in it.
  if (showCurrent && people.length === 1) {
    return null;
  }
  return (
    <>
      <h3>{title}</h3>
      <PersonList people={people} showDates showCurrent={showCurrent} />
    </>
  );
}
