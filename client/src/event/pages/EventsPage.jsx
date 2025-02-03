import React from 'react';
import { Link, useParams } from 'react-router-dom';

import EventsTable from 'event/components/EventsTable';
import useEvents from 'event/hooks/useEvents';
import BulletList from 'shared/BulletList';
import Filter from 'shared/Filter';
import Spacer from 'shared/Spacer';

const eventCategories = [
  { to: 'birth', title: 'birth' },
  { to: 'baptism', title: 'christening & baptism' },
  { to: 'marriage', title: 'engagement, marriage, & divorce' },
  { to: 'death', title: 'death' },
  { to: 'immigration', title: 'immigration' },
  { to: 'military', title: 'military' },
  { to: 'other', title: 'other' },
  { to: 'historical', title: 'historical' },
  { to: 'all', title: 'all' },
];

const filterId = 'FILTER_EVENTS_PAGE_TABLE';

export default function EventsPage() {
  const { category } = useParams();
  const { events } = useEvents({ category, filterId });

  return (
    <>
      <h1>Events</h1>
      <Link to="http://localhost:9000/events">old version</Link>
      <Spacer />
      <BulletList>
        {eventCategories.map(({ to, title }) => (
          <li key={to}>
            <Link to={`/events/${to}`}>{title}</Link>
          </li>
        ))}
      </BulletList>
      <p>Results: {events.length}</p>
      <Filter filterId={filterId} />
      <EventsTable events={events} />
    </>
  );
}
