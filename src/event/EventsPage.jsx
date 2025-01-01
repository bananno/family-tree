import React from 'react';

import useEventList from 'event/useEventList';
import BulletList from 'shared/BulletList';

export default function EventsPage() {
  const { events } = useEventList();

  return (
    <>
      <h1>Events</h1>
      <BulletList>
        {events.map(event => (
          <li key={event.id}>{event.title}</li>
        ))}
      </BulletList>
    </>
  );
}
