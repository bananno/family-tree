import React, { useEffect, useState } from 'react';

import PersonProfileIcon from 'person/components/PersonProfileIcon';
import { usePersonContext } from 'person/PersonContext';
import api from 'shared/api';

export default function PersonAvatarPage() {
  const { person } = usePersonContext();
  const { avatars } = usePersonAvatars();

  return (
    <>
      <h2>Avatar</h2>
      {avatars.map((avatar, i) => (
        <div key={avatar.id} style={{ margin: '5px'}}>
          <PersonProfileIcon src={avatar.url} large square />
          <PersonProfileIcon src={avatar.url} medium />
        </div>
      ))}
    </>
  );
}

////////////////////

function usePersonAvatars() {
  const { personId } = usePersonContext();
  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchAvatars() {
    setLoading(true);
    const response = await api(`people/${personId}/avatars`);
    const json = await response.json();
    setAvatars(json.data);
    setLoading(false);
  }

  useEffect(() => {
    fetchAvatars();
  }, [personId]);

  return { avatars, loading, refetch: fetchAvatars };
}
