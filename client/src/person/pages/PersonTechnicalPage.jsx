import React from 'react';

import { usePersonContext } from 'person/PersonContext';
import TagList from 'tag/components/TagList';

export default function PersonTechnicalPage() {
  const { person } = usePersonContext();

  return (
    <>
      <h3>share level</h3>
      {person.shareLevel}
      <h3>tags</h3>
      <TagList tags={person.tags} />
      <h3>record created</h3>
      {person.createdAt}
      <h3>record updated</h3>
      {person.updatedAt}
      <p>
        <i>
          If I had a "test" person that was no longer needed, I sometimes
          repurposed them later instead of deleting them. So the creation date
          might be earlier than when I actually began researching this person.
        </i>
      </p>
    </>
  );
}
