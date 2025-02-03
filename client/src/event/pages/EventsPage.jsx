import React from 'react';
import { Link, useParams } from 'react-router-dom';

import useEvents from 'event/hooks/useEvents';
import PersonList from 'person/components/PersonList';
import BulletList from 'shared/BulletList';
import Table from 'shared/Table';

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

export default function EventsPage() {
  const { category } = useParams();
  const { events } = useEvents({ category });

  return (
    <>
      <h1>Events</h1>
      <BulletList>
        {eventCategories.map(({ to, title }) => (
          <li key={to}>
            <Link to={`/events/${to}`}>{title}</Link>
          </li>
        ))}
      </BulletList>
      <p>Results: {events.length}</p>
      <Table>
        <tbody>
          <tr>
            <th>title</th>
            <th colSpan="3">date</th>
            <th>location</th>
            <th>people</th>
            <th>notes</th>
            <th>tags</th>
          </tr>
        </tbody>
        {events.map(event => (
          <tr key={event.id}>
            <td>{event.title}</td>
            <td>{event.date.year === 0 ? '' : event.date.year}</td>
            <td>{event.date.month === 0 ? '' : event.date.month}</td>
            <td>{event.date.day === 0 ? '' : event.date.day}</td>
            <td />
            <td>
              <PersonList people={event.people} smallText />
            </td>
            <td />
            <td />
          </tr>
        ))}
      </Table>
    </>
  );
}
