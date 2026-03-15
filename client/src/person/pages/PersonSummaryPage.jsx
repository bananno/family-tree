import React from 'react';
import { Link } from 'react-router-dom';

import PersonImmediateFamily from 'person/components/PersonImmediateFamily';
import PersonList from 'person/components/PersonList';
import PersonTree from 'person/components/PersonTree';
import { usePersonContext } from 'person/PersonContext';
import { ROUTE_PATHS } from 'routePaths';
import useSessionContext from 'session/useSessionContext';
import FormatDate from 'shared/FormatDate';
import FormatLocation from 'shared/FormatLocation';

export default function PersonSummaryPage() {
  const { person } = usePersonContext();

  return (
    <>
      {person.profileSummary && <p className="m-2">{person.profileSummary}</p>}
      <PersonBirthEventCard person={person} />
      <PersonDeathEventCard person={person} />
      <PersonImmediateFamily />
      <hr className="my-4" />
      <h3 className="text-lg font-semibold mb-2">tree</h3>
      <PersonTree person={person} />
    </>
  );
}

////////////////////

function PersonBirthEventCard() {
  const { person } = usePersonContext();
  const event = person.birth;

  if (!event) {
    return <VitalEventCard title="birth - unknown" />;
  }

  return <VitalEventCard event={event} />;
}

function PersonDeathEventCard() {
  const { person } = usePersonContext();

  if (person.living) {
    return <VitalEventCard title="living" />;
  }

  const event = person.death;

  if (!event) {
    return <VitalEventCard title="death - unknown" />;
  }

  // If birth and death are the same event, e.g. "birth and death",
  // only show birth and skip death.
  if (event.id === person.birth?.id) {
    return null;
  }

  return <VitalEventCard event={event} />;
}

function VitalEventCard({ title, event }) {
  const { admin } = useSessionContext();

  return (
    <div className="rounded-lg bg-white shadow-sm border border-gray-200 p-4 mb-3">
      {title && (
        <h3 className="text-lg font-semibold text-gray-500 italic">{title}</h3>
      )}
      {event && (
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">
            {admin ? (
              <Link to={ROUTE_PATHS.eventDetail(event.id)}>{event.title}</Link>
            ) : (
              event.title
            )}
          </h3>
          {event.date && (
            <p className="text-gray-600">
              <FormatDate date={event.date} />
            </p>
          )}
          {event.location && (
            <p className="text-gray-600">
              <FormatLocation location={event.location} variant="full" />
            </p>
          )}
          {event.notes && (
            <div className="mt-2 bg-gray-100 rounded p-2 text-gray-700">
              {event.notes.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          )}
          {event.people.length > 1 && (
            <div className="mt-2">
              <PersonList people={event.people} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
