import { useEffect, useState } from 'react';

import { usePersonContext } from 'person/PersonContext';

const API_URL = 'http://localhost:9000';

export default function usePersonChecklist() {
  const { personId } = usePersonContext();
  const [checklistResponse, setChecklistResponse] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch(`${API_URL}/people/${personId}/checklist`)
      .then(res => res.json())
      .then(res => {
        setChecklistResponse(res.data);
      })
      .catch(err => {
        console.log('ERROR', err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [personId]);

  return {
    sections: checklistResponse?.checklistSections || [],
    otherIncompleteSources: checklistResponse?.otherIncompleteSources || [],
    loading,
  };
}
