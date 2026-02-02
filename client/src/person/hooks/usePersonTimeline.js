import { useEffect, useState } from 'react';

import { usePersonContext } from 'person/PersonContext';
import api from 'shared/api';

export default function usePersonTimeline() {
  const { personId } = usePersonContext();
  const [timelineItems, setTimelineItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTimeline();
  }, [personId]);

  async function fetchTimeline() {
    setLoading(true);

    const { result, error } = await api(`/people/${personId}/timeline`);

    if (error || !result?.items) {
      console.error('Error fetching person timeline:', error);
    }

    setTimelineItems(result?.items || []);
    setLoading(false);
  }

  return { timelineItems, loading };
}
