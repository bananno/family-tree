import { useState, useEffect } from 'react';

import api from 'shared/api';
import { useFilter } from 'shared/FilterContext';

export default function useEvents({ category, filterId }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getFilteredList } = useFilter();

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

  const filteredEvents = getFilteredList(filterId, events, eventToKeywords);

  return { events: filteredEvents, loading };
}

////////////////////

function eventToKeywords(event) {
  return [
    event.title,
    event.location.country,
    event.location.region1,
    event.location.region2,
    event.location.city,
    ...event.people.map(person => person.name),
    ...event.tags.map(tag => tag.title),
    ...event.tags.map(tag => tag.value),
  ].join(' ');
}
