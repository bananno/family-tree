import { useState, useEffect } from 'react';

import api from 'shared/api';

export default function useEvents({ category }) {
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

  return { events, loading };
}
