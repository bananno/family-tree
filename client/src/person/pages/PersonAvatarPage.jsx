import React, { useEffect, useState } from 'react';

import PersonProfileIcon from 'person/components/PersonProfileIcon';
import UploadAvatarForm from 'person/components/UploadAvatarForm';
import { usePersonContext } from 'person/PersonContext';
import api from 'shared/api';
import Button from 'shared/form/Button';
import Modal from 'shared/Modal';
import Spacer from 'shared/Spacer';

export default function PersonAvatarPage() {
  const { avatars, refetch } = usePersonAvatars();
  const [deletingAvatar, setDeletingAvatar] = useState(null);

  return (
    <>
      <h2>Avatar</h2>
      <Spacer />
      <h3>Add new</h3>
      <p>Must be square. Reduce to 300x300 px.</p>
      <UploadAvatarForm refetch={refetch} />
      <Spacer />
      {avatars.map((avatar, i) => (
        <div
          key={avatar.id}
          style={{
            display: 'flex',
            margin: '5px',
            padding: '5px',
            borderColor: deletingAvatar === avatar.id ? 'red' : 'gray',
            borderStyle: 'solid',
            borderWidth: avatar.selected ? '2px' : '1px',
          }}
        >
          <div style={{ flex: 2 }}>
            <PersonProfileIcon src={avatar.url} large square />
            <PersonProfileIcon src={avatar.url} medium />
          </div>
          <div style={{ flex: 1 }}>
            {avatar.selected ? (
              <>
                Selected
                <br />
              </>
            ) : null}
            <Button onClick={() => setDeletingAvatar(avatar)}>Delete</Button>
          </div>
        </div>
      ))}
      {deletingAvatar !== null && (
        <DeleteAvatarModal
          avatar={deletingAvatar}
          closeModal={() => setDeletingAvatar(null)}
          refetchAvatars={refetch}
        />
      )}
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

function DeleteAvatarModal({ avatar, closeModal, refetchAvatars }) {
  const { personId, refetch: refetchPerson } = usePersonContext();

  const path = `people/${personId}/avatars/${avatar.id}`;

  async function handleConfirm() {
    await api(path, { method: 'DELETE' });

    refetchAvatars();
    closeModal();

    if (avatar.selected) {
      refetchPerson();
    }
  }

  return (
    <Modal
      title="Delete avatar?"
      open
      onConfirm={handleConfirm}
      onCancel={closeModal}
    />
  );
}
