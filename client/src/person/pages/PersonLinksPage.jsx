import React from 'react';

import { usePersonContext } from 'person/PersonContext';
import LinkList from 'shared/LinkList';

export default function PersonLinksPage() {
  const { person } = usePersonContext();

  return (
    <>
      <h2>Links</h2>
      <LinkList links={person.links} />
    </>
  );
}
