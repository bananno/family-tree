import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import useEvents from 'event/hooks/useEvents';
import PersonList from 'person/components/PersonList';
import BulletList from 'shared/BulletList';
import Filter from 'shared/Filter';
import Spacer from 'shared/Spacer';
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
  const [filterWords, setFilterWords] = useState([]);
  const { events } = useEvents({ category, filterWords });

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
      <Filter onChange={setFilterWords} />
      <Table>
        <thead>
          <tr>
            <th>title</th>
            <th>date</th>
            <th colSpan="2">location</th>
            <th>people</th>
            <th>notes / tags</th>
          </tr>
        </thead>
        <tbody>
          {events.map(event => (
            <tr key={event.id}>
              <td>{event.title || '(missing title)'}</td>
              <td>
                <FormatDate date={event.date} />
              </td>
              <td>
                <FormatLocation location={event.location} />
              </td>
              <td>
                <FormatCountry location={event.location} />
              </td>
              <td style={{ minWidth: '200px' }}>
                <PersonList people={event.people} smallText />
              </td>
              <td>
                {event.notes}
                {event.tags.length > 0 && (
                  <>
                    <Spacer />
                    <b>tags:</b>
                    <BulletList>
                      {event.tags.map(tag => (
                        <li key={tag.id}>
                          {tag.title}
                          {tag.value ? `: ${tag.value}` : ''}
                        </li>
                      ))}
                    </BulletList>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

////////////////////

function FormatDate({ date }) {
  const display = getDisplayDate(date);

  if (date.display) {
    if (display === '') {
      return date.display;
    }
    return (
      <>
        {date.display}
        <br />
        <span style={{ color: '#bbb' }}>
          <i>sort: {display}</i>
        </span>
      </>
    );
  }

  return display;
}

function getDisplayDate(date) {
  const { year, month, day } = date;

  if (year === 0) {
    return '';
  }

  if (month === 0) {
    return year;
  }

  const dateObj = new Date(year, month - 1, day || 1);

  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: day === 0 ? undefined : 'numeric',
  });
}

function FormatLocation({ location }) {
  const { region1: stateOrRegion, region2: county, city } = location;

  return [city, county, stateOrRegion].filter(Boolean).join(', ');
}

function FormatCountry({ location }) {
  return location.country === 'United States' ? 'USA' : location.country;
}
