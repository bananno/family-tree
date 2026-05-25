import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import PersonProfileIcon from 'person/components/PersonProfileIcon';
import Button from 'shared/form/Button';
import modalClasses from 'shared/Modal.module.scss';
import { usePeopleContext } from 'shared/PeopleContext';

export default function PersonListEditor({
  label,
  currentPeople,
  excludeIds = [],
  onAdd,
  onRemove,
  onReorder,
  confirmBeforeRemove = false,
  singleColumn = false,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-1">
          <label className="block text-sm font-semibold text-gray-600 capitalize">
            {label}
          </label>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="text-sm text-link hover:text-link-hover"
          >
            edit
          </button>
        </div>
        {currentPeople.length === 0 ? (
          <p className="text-sm text-gray-400">None</p>
        ) : (
          <div
            className={clsx(
              'flex gap-2',
              singleColumn ? 'flex-col' : 'flex-wrap',
            )}
          >
            {currentPeople.map(person => (
              <div
                key={person.id}
                className="flex items-center gap-2 bg-gray-100 rounded-full pl-1 pr-3 py-1"
              >
                <PersonProfileIcon person={person} />
                <span className="text-sm">{person.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <EditorModal
          label={label}
          currentPeople={currentPeople}
          excludeIds={excludeIds}
          onAdd={onAdd}
          onRemove={onRemove}
          onReorder={onReorder}
          onClose={() => setIsOpen(false)}
          confirmBeforeRemove={confirmBeforeRemove}
        />
      )}
    </>
  );
}

function EditorModal({
  label,
  currentPeople,
  excludeIds,
  onAdd,
  onRemove,
  onReorder,
  onClose,
  confirmBeforeRemove,
}) {
  const { people } = usePeopleContext();
  const [search, setSearch] = useState('');
  const [confirmRemove, setConfirmRemove] = useState(null);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const currentIds = new Set(currentPeople.map(p => p.id));
  const excludeSet = new Set([...excludeIds, ...currentIds]);

  const filteredPeople = search.trim()
    ? people
        .filter(
          p =>
            !excludeSet.has(p.id) &&
            p.name.toLowerCase().includes(search.toLowerCase()),
        )
        .slice(0, 10)
    : [];

  async function handleSelect(personId) {
    setSearch('');
    const person = people.find(p => p.id === personId);
    await onAdd(person);
  }

  async function handleConfirmRemove() {
    const id = confirmRemove;
    setConfirmRemove(null);
    await onRemove(id);
  }

  function onClickBackdrop(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  function handleStartRemove(personId) {
    if (confirmBeforeRemove) {
      setConfirmRemove(personId);
    } else {
      onRemove(personId);
    }
  }

  return (
    <div className={modalClasses.Modal} onClick={onClickBackdrop}>
      <div className={modalClasses.modalContent} style={{ minWidth: 360 }}>
        <h2>Edit {label}</h2>

        {currentPeople.length === 0 && (
          <p className="text-sm text-gray-400 mb-3">None</p>
        )}

        <div className="mb-4">
          {currentPeople.map((person, index) => (
            <div
              key={person.id}
              className="flex items-center gap-2 py-2 border-b border-gray-100"
            >
              <PersonProfileIcon person={person} />
              <span className="text-sm flex-1">{person.name}</span>

              {onReorder && (
                <div className="flex flex-col">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => onReorder(index)}
                    className="text-gray-400 hover:text-gray-700 disabled:opacity-25 text-xs leading-none px-1"
                    title="Move up"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    disabled={index === currentPeople.length - 1}
                    onClick={() => onReorder(index + 1)}
                    className="text-gray-400 hover:text-gray-700 disabled:opacity-25 text-xs leading-none px-1"
                    title="Move down"
                  >
                    ▼
                  </button>
                </div>
              )}

              {confirmRemove === person.id ? (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleConfirmRemove}
                    className="text-red-600 hover:text-red-800 text-xs font-semibold"
                  >
                    confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmRemove(null)}
                    className="text-gray-400 hover:text-gray-600 text-xs"
                  >
                    cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleStartRemove(person.id)}
                  className="text-gray-400 hover:text-red-500 text-lg leading-none px-1"
                  title="Remove"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search to add...`}
            className="border border-gray-300 rounded px-3 py-1.5 text-sm w-full"
          />
          {filteredPeople.length > 0 && (
            <div className="absolute z-10 bg-white border border-gray-300 rounded shadow-lg mt-1 max-h-80 overflow-y-auto w-full">
              {filteredPeople.map(person => (
                <button
                  key={person.id}
                  type="button"
                  onClick={() => handleSelect(person.id)}
                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-left"
                >
                  <PersonProfileIcon person={person} />
                  <span className="text-sm">{person.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={modalClasses.modalActions}>
          <Button onClick={onClose} text="Done" />
        </div>
      </div>
    </div>
  );
}
