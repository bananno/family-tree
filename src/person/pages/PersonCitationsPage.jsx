import React from 'react';

import CitationList from 'citation/components/CitationList';
import { usePersonContext } from 'person/PersonContext';

export default function PersonCitationsPage() {
  const { person } = usePersonContext();

  return (
    <>
      <h2>Citations for {person.name}</h2>
      <CitationList citations={person.citations} showPerson={false} />
    </>
  );
}
