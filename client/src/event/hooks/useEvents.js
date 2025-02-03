import { useState, useEffect } from 'react';

import api from 'shared/api';

export default function useEvents({ category, filterWords }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchEvents() {
    if (!category) {
      setLoading(false);
      setEvents([]);
      return;
    }
    setLoading(true);
    try {
      const queryParams = category === 'all' ? '' : `?category=${category}`;
      const res = await api(`api/events${queryParams}`);
      const json = await res.json();
      setEvents(json.events);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, [category]);

  const filteredEvents =
    filterWords.length === 0
      ? events
      : events.filter(event => eventMatchesFilter(event, filterWords));

  return { events: filteredEvents, loading };
}

function eventMatchesFilter(event, filterWords) {
  const eventContent = [
    event.title,
    event.location.country,
    event.location.region1,
    event.location.region2,
    event.location.city,
    ...event.people.map(person => person.name),
    ...event.tags.map(tag => tag.title),
    ...event.tags.map(tag => tag.value),
  ].join(' ');

  return filterWords.every(regExp => regExp.test(eventContent));
}
