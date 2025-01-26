import React, { useState } from 'react';

import { usePersonContext } from 'person/PersonContext';
import api from 'shared/api';
import DevOnly from 'shared/DevOnly';
import Divider from 'shared/Divider';
import Button from 'shared/form/Button';
import Input from 'shared/form/Input';
import LinkList, { FormattedLink } from 'shared/LinkList';
import Modal from 'shared/Modal';
import Spacer from 'shared/Spacer';

// DONE:
// Show list of links

// TODO:
// Ability to edit the value of a link
// Ability to reorder links
// Ability to delete links, with popup confirmation
// Ability to add a new link
// Refetch links after a change (separate endpoint?)
// Populate the text value for a new link, based on the url
//    (example: if url matches FamilySearch.org, use "FamilySearch")
// Make it easy to add links that are known to be missing
//    (example: if there's no FamilySearch link yet, provide a quick way to add one)

export default function PersonLinksPage() {
  const { person } = usePersonContext();
  const [editing, setEditing] = useState(false);

  return (
    <>
      <h2>Links</h2>
      {editing ? (
        <EditLinksSection
          links={person.links}
          onDone={() => setEditing(false)}
        />
      ) : (
        <>
          <LinkList links={person.links} />
          <DevOnly>
            <Divider />
            <Button
              onClick={() => setEditing(true)}
              style={{ marginRight: '5px' }}
            >
              Edit
            </Button>
          </DevOnly>
        </>
      )}
      <DevOnly>
        <NewLinkModal />
      </DevOnly>
    </>
  );
}

////////////////////

function EditLinksSection({ links, onDone }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [deletingIndex, setDeletingIndex] = useState(null);

  return (
    <>
      <Spacer />
      {links.map((link, index) => (
        <div key={index}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: '10px 0',
            }}
          >
            <div style={{ flex: '3' }}>
              <FormattedLink link={link} />
            </div>
            <div style={{ flex: '1' }}>
              <Button
                style={{
                  marginLeft: '5px',
                  visibility: index === 0 ? 'hidden' : 'visible',
                }}
              >
                &#9650;
              </Button>
              <Button
                style={{ marginLeft: '5px' }}
                onClick={() => setDeletingIndex(index)}
              >
                &#10006;
              </Button>
              <Button
                style={{ marginLeft: '5px' }}
                onClick={() => setEditingIndex(index)}
              >
                edit
              </Button>
            </div>
          </div>
        </div>
      ))}
      <Button onClick={onDone} style={{ marginRight: '5px' }}>
        Done
      </Button>
      {editingIndex !== null && (
        <EditLinkValueModal
          editingIndex={editingIndex}
          link={links[editingIndex]}
          onCancel={() => setEditingIndex(null)}
        />
      )}
      {deletingIndex !== null && (
        <DeleteLinkModal
          deleteIndex={deletingIndex}
          link={links[deletingIndex]}
          onCancel={() => setDeletingIndex(null)}
        />
      )}
    </>
  );
}

function NewLinkModal() {
  return <NewOrEditLinkModal title="New Link" />;
}

function EditLinkValueModal({ editingIndex, link, onCancel }) {
  return (
    <NewOrEditLinkModal title="Edit Link" link={link} onCancel={onCancel} />
  );
}

function NewOrEditLinkModal({ title, onCancel }) {
  const { personId } = usePersonContext();
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');

  async function handleConfirm() {
    const requestBody = {
      action: 'add',
      url: url.trim(),
      text: text.trim(),
    };

    await api(`people/${personId}/links`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    clearForm();
  }

  function onCancel() {
    clearForm();
  }

  function clearForm() {
    setUrl('');
    setText('');
  }

  const isValid = url.trim() !== '';

  return (
    <Modal
      title={title}
      onConfirm={handleConfirm}
      confirmEnabled={isValid}
      onCancel={onCancel}
      triggerButtonLabel="Add Link"
    >
      <Input
        value={url}
        onChange={setUrl}
        textarea
        style={{ height: '80px' }}
        placeholder="URL"
      />
      <br />
      <Input value={text} onChange={setText} placeholder="display text" />
    </Modal>
  );
}

function DeleteLinkModal({ deleteIndex, link, onCancel }) {
  async function handleConfirm() {
    onCancel();
  }

  return (
    <Modal
      title="Delete link?"
      open
      onConfirm={handleConfirm}
      onCancel={onCancel}
    >
      {link.url} {link.text}
    </Modal>
  );
}
