import React, { useState } from 'react';

import { usePersonContext } from 'person/PersonContext';
import DevOnly from 'shared/DevOnly';
import LinkList, { FormattedLink } from 'shared/LinkList';
import Button from 'shared/form/Button';
import Input from 'shared/form/Input';
import Divider from 'shared/Divider';
import Spacer from 'shared/Spacer';
import Modal from 'shared/Modal';

// DONE:
// Show list of links

// TODO:
// Ability to edit the value of a link
// Ability to reorder links
// Ability to delete links, with popup confirmation
// Ability to add a new link
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

function NewLinkModal({}) {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');

  async function handleConfirm() {
    clearForm();
  }

  function clearForm() {
    setUrl('');
    setText('');
  }

  return (
    <Modal
      title="New Link"
      triggerButtonLabel="Add Link"
      onConfirm={handleConfirm}
      onCancel={clearForm}
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

function EditLinkValueModal({ editingIndex, link, onCancel }) {
  return (
    <Modal title="Edit Link" open onCancel={onCancel}>
      <Input value={link.url} textarea style={{ height: '80px' }} />
      <br />
      <Input value={link.text} />
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
