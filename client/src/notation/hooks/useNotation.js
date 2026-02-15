import { useState, useEffect } from 'react';

import useSessionContext from 'session/useSessionContext';
import api from 'shared/api';

export default function useNotation({ id }) {
  const { currentUser } = useSessionContext();

  const [loading, setLoading] = useState(true);
  const [notation, setNotation] = useState(null);
  const [notFound, setNotFound] = useState(false);

  async function fetchNotation() {
    const { notFound, result } = await api(`/notations/${id}`);

    setLoading(false);
    setNotation(notFound ? null : result || null);
    setNotFound(notFound);
  }

  useEffect(() => {
    setLoading(true);
    setNotation(null);
    setNotFound(false);

    fetchNotation();
  }, [currentUser, id]);

  return { loading, notation, notFound };
}
