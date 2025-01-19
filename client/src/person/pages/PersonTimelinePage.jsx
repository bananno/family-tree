import React from 'react';

import PersonTimeline from 'person/components/PersonTimeline';
import usePersonTimeline from 'person/hooks/usePersonTimeline';
import { usePersonContext } from 'person/PersonContext';
import useEnvironment from 'shared/useEnvironment';

export default function PersonTimelinePage() {
  const { person } = usePersonContext();
  const { timelineItems } = usePersonTimeline();
  const { isProduction } = useEnvironment();

  return (
    <>
      <h2>Timeline for {person.name}</h2>
      {isProduction && <p>(to do)</p>}
      <PersonTimeline timelineItems={timelineItems} />
    </>
  );
}
