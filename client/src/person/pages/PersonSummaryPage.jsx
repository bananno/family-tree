import React from 'react';
import { Link } from 'react-router-dom';

import PersonImmediateFamily from 'person/components/PersonImmediateFamily';
import PersonList from 'person/components/PersonList';
import PersonTree from 'person/components/PersonTree';
import { usePersonContext } from 'person/PersonContext';
import { ROUTE_PATHS } from 'routePaths';
import AdminOnly from 'session/AdminOnly';

export default function PersonSummaryPage() {
  const { person } = usePersonContext();

  return (
    <>
      {person.profileSummary && <p>{person.profileSummary}</p>}
      <BirthAndDeath title="birth" event={person.birth} person={person} />
      <BirthAndDeath title="death" event={person.death} person={person} />
      <PersonImmediateFamily />
      <hr />
      <h3>tree</h3>
      <PersonTree person={person} />
    </>
  );
}

////////////////////

function BirthAndDeath({ event, person, title }) {
  if (!event) {
    return (
      <div
        style={{
          border: '1px solid gray',
          padding: '10px',
          marginBottom: '10px',
        }}
      >
        <h3>{title} - unknown</h3>
      </div>
    );
  }
  return (
    <div
      style={{
        border: '1px solid gray',
        padding: '10px',
        marginBottom: '10px',
      }}
    >
      <h3>
        {event.title}{' '}
        <AdminOnly>
          <Link to={ROUTE_PATHS.eventDetail(event.id)}>(event)</Link>
        </AdminOnly>
      </h3>
      {event.date.year}-{event.date.month}-{event.date.day} /{' '}
      {event.date.display}
      <br />
      {[
        event.location.city,
        event.location.region2,
        event.location.region1,
        event.location.country !== 'United States' && event.location.country,
      ]
        .filter(Boolean)
        .join(', ')}
      {event.people.length > 1 && <PersonList people={event.people} />}
    </div>
  );
}
