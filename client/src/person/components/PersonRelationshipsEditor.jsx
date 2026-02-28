import React from 'react';

import PersonListEditor from 'person/components/PersonListEditor';
import { usePersonContext } from 'person/PersonContext';
import api from 'shared/api';
import { usePeopleContext } from 'shared/PeopleContext';

const RELATIONSHIP_TYPES = [
  { key: 'parents', label: 'Parents' },
  { key: 'spouses', label: 'Spouses' },
  { key: 'children', label: 'Children' },
];

export default function PersonRelationshipsEditor() {
  const { person, refetch: refetchPerson } = usePersonContext();
  const { refetch: refetchPeople } = usePeopleContext();

  async function handleAdd(relationship, relativeId) {
    await api(`people/${person.id}/relationships`, {
      method: 'POST',
      body: { action: 'add', relationship, relativeId },
    });
    await refetchPerson();
    await refetchPeople();
  }

  async function handleRemove(relationship, relativeId) {
    await api(`people/${person.id}/relationships`, {
      method: 'POST',
      body: { action: 'delete', relationship, relativeId },
    });
    await refetchPerson();
    await refetchPeople();
  }

  async function handleReorder(relationship, index) {
    await api(`people/${person.id}/relationships`, {
      method: 'POST',
      body: { action: 'reorder', relationship, index },
    });
    await refetchPerson();
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Relationships</h3>
      {RELATIONSHIP_TYPES.map(({ key, label }) => (
        <PersonListEditor
          key={key}
          label={label}
          currentPeople={person[key] || []}
          excludeIds={[person.id]}
          onAdd={relativeId => handleAdd(key, relativeId)}
          onRemove={relativeId => handleRemove(key, relativeId)}
          onReorder={index => handleReorder(key, index)}
        />
      ))}
    </div>
  );
}
