import { useEffect, useState } from 'react';

import { usePersonContext } from 'person/PersonContext';
import useEnvironment from 'shared/useEnvironment';

const API_URL = 'http://localhost:9000';

export default function usePersonTimeline() {
  const { personId } = usePersonContext();
  const { isProduction } = useEnvironment();
  const [timelineItems, setTimelineItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    if (isProduction) {
      setTimelineItems(getStaticResponse(personId));
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/people/${personId}/timeline`)
      .then(res => res.json())
      .then(res => {
        setTimelineItems(res.data);
      })
      .catch(err => {
        console.log('ERROR', err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isProduction, personId]);

  return { timelineItems, loading };
}

////////////////////

// TODO
function getStaticResponse(personId) {
  return [];
}
