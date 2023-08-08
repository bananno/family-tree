import React, {useEffect, useState} from 'react';

function EventsPage() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:9000/api/event-index')
      .then((res) => res.json())
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => {
        console.log('ERROR', err.message);
      });
  }, []);

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

