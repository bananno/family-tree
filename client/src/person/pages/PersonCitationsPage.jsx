import React, { useEffect, useState } from 'react';

import CitationList from 'citation/components/CitationList';
import { usePersonContext } from 'person/PersonContext';
import api from 'shared/api';

export default function PersonCitationsPage() {
  const { person } = usePersonContext();
  const [citations, setCitations] = useState([]);

  async function fetchCitations() {
    const { result, error } = await api(`/citations?personId=${person.id}`);
    setCitations(result?.items || []);
  }

  useEffect(() => {
    setCitations([]);
    fetchCitations();
  }, [person.id]);

  return (
    <>
      <h2>Citations for {person.name}</h2>
      <CitationList citations={citations} showPerson={false} />
    </>
  );
}
