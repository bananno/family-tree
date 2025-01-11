import React from 'react';

import PersonImmediateFamily from 'person/components/PersonImmediateFamily';
import PersonTree from 'person/components/PersonTree';
import { usePersonContext } from 'person/PersonContext';
import DevOnly from 'shared/DevOnly';

export default function PersonSummaryPage() {
  const { person } = usePersonContext();

  return (
    <>
      <DevOnly>
        <>
          <h3>TODO: show birth/death event details here</h3>
          <hr />
        </>
      </DevOnly>
      <PersonImmediateFamily />
      <hr />
      <h3>tree</h3>
      <PersonTree person={person} />
    </>
  );
}

