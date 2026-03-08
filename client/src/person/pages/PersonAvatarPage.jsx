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

  const avatarsSorted = [
    ...avatars.filter(avatar => avatar.selected),
    ...avatars.filter(avatar => !avatar.selected),
  ];

  console.log('avatars', avatars);

  return (
    <>
      <h2 className="text-2xl font-bold">Avatar</h2>
      <Spacer />
      <h3 className="text-lg font-semibold mb-1">Add new</h3>
      <p className="text-sm text-gray-500 mb-3">
        Must be square. Reduce to 300x300 px.
      </p>
      <UploadAvatarForm refetch={refetch} />
      <Spacer />
      <div className="flex flex-col gap-3">
        {avatarsSorted.map(avatar => (
          <div
            key={avatar.id}
            className={`flex items-center gap-4 rounded-lg border p-3 ${
              avatar.selected
                ? 'border-2 border-[var(--color-link)] bg-sky-50'
                : deletingAvatar?.id === avatar.id
                  ? 'border-red-400'
                  : 'border-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <PersonProfileIcon src={avatar.url} large square />
              <PersonProfileIcon src={avatar.url} medium />
            </div>
            <div className="flex flex-col gap-2 ml-auto">
              {avatar.selected && (
                <span className="text-sm font-semibold text-[var(--color-link)]">
                  Selected
                </span>
              )}
              <SelectOrDeselectAvatarButton
                avatar={avatar}
                refetchAvatars={refetch}
              />
              <Button onClick={() => setDeletingAvatar(avatar)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>
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
    const { result } = await api(`people/${personId}/avatars`);
    setAvatars(result.items);
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

function SelectOrDeselectAvatarButton({ avatar, refetchAvatars }) {
  const { personId, refetch: refetchPerson } = usePersonContext();

  async function handleClick() {
    await api(`people/${personId}/avatars`, {
      method: 'PATCH',
      body: JSON.stringify({ avatarId: avatar.selected ? null : avatar.id }),
    });

    refetchPerson();
    refetchAvatars();
  }

  return (
    <Button onClick={handleClick}>
      {avatar.selected ? 'Deselect' : 'Select'}
    </Button>
  );
}
