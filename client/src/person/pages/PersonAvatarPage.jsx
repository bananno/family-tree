import React, { useEffect, useState } from 'react';

import PersonProfileIcon from 'person/components/PersonProfileIcon';
import UploadAvatarForm from 'person/components/UploadAvatarForm';
import { usePersonContext } from 'person/PersonContext';
import api from 'shared/api';
import Spacer from 'shared/Spacer';

export default function PersonAvatarPage() {
  const { personId } = usePersonContext();
  const { avatars, refetch } = usePersonAvatars();

  return (
    <>
      <h2>Avatar</h2>
      <Spacer />
      <h3>Add new</h3>
      <p>Must be square. Reduce to 300x300 px.</p>
      <UploadAvatarForm refetch={refetch} />
      <Spacer />
      {avatars.map((avatar, i) => (
        <div key={avatar.id} style={{ margin: '5px' }}>
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
