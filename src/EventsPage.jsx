import React from 'react';

import useEventList from './hooks/useEventList';

function EventsPage() {
  const {events} = useEventList();

  return (
    <div>
      <h2>events</h2>
      <ul>
        {events.map(event => (
          <li key={event.id}>
            {event.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default EventsPage;
