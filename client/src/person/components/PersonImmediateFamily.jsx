import React from 'react';

import PersonList from 'person/components/PersonList';
import { usePersonContext } from 'person/PersonContext';
import globalClasses from 'shared/global.module.scss';

export default function PersonImmediateFamily() {
  const { person } = usePersonContext();

  const totalFamily =
    person.parents.length +
    person.siblings.length +
    person.spouses.length +
    person.children.length;

  // Note that the siblings list contains the current person.
  const withParents = person.parents.length > 0;
  const withSiblings = person.siblings.length > 1;
  const withSpouses = person.spouses.length > 0;

  const atLeastFirstThreeSections = withParents && withSiblings && withSpouses;

  if (totalFamily > 10 || atLeastFirstThreeSections) {
    return (
      <>
        <div className={globalClasses.column} style={{ paddingRight: '20px' }}>
          <Parents />
          <Siblings />
        </div>
        <div className={globalClasses.column} style={{ paddingRight: '20px' }}>
          <Spouses />
          <Children />
        </div>
      </>
    );
  }

  return (
    <>
      <Parents />
      <Siblings />
      <Spouses />
      <Children />
    </>
  );

  // TODO: add more configurations as examples arise.
  // Examples:
  // - 2 + 1: 5bec872bffb349d8b25b1fdf
  // - 2 + 2: 5beb67fe188f87d2b59f9dbc
}

////////////////////

function Parents() {
  const { person } = usePersonContext();
  return <PersonFamilySection title="parents" people={person.parents} />;
}

function Spouses() {
  const { person } = usePersonContext();
  return <PersonFamilySection title="spouses" people={person.spouses} />;
}

function Siblings() {
  const { person } = usePersonContext();
  return (
    <PersonFamilySection
      title="siblings"
      people={person.siblings}
      showCurrent={person.id}
    />
  );
}

function Children() {
  const { person } = usePersonContext();
  return <PersonFamilySection title="children" people={person.children} />;
}

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
      <h3 style={{ margin: '20px 0' }}>{title}</h3>
      <PersonList
        people={people}
        showDates
        showCurrent={showCurrent}
        mediumIcon
      />
    </>
  );
}
