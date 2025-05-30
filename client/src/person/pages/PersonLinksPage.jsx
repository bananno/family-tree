import React, { useEffect, useState } from 'react';

import { usePersonContext } from 'person/PersonContext';
import api from 'shared/api';
import DevOnly from 'shared/DevOnly';
import Divider from 'shared/Divider';
import Button from 'shared/form/Button';
import Input from 'shared/form/Input';
import LinkList, { FormattedLink } from 'shared/LinkList';
import Modal from 'shared/Modal';
import Spacer from 'shared/Spacer';

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
        <NewOrEditLinkModal />
        <MissingItemsSection />
      </DevOnly>
    </>
  );
}

////////////////////

function EditLinksSection({ links, onDone }) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const { personId, refetch: refetchPerson } = usePersonContext();

  async function reorderLink(reorderIndex) {
    const requestBody = {
      action: 'reorder',
      index: reorderIndex,
    };

    await api(`people/${personId}/links`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    refetchPerson();
  }

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
                onClick={() => reorderLink(index)}
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
        <NewOrEditLinkModal
          editingIndex={editingIndex}
          link={links[editingIndex]}
          closeModal={() => setEditingIndex(null)}
        />
      )}
      {deletingIndex !== null && (
        <DeleteLinkModal
          deleteIndex={deletingIndex}
          link={links[deletingIndex]}
          closeModal={() => setDeletingIndex(null)}
        />
      )}
    </>
  );
}

function NewOrEditLinkModal({ link, editingIndex, closeModal }) {
  const addingNew = !link;

  const { personId, refetch: refetchPerson } = usePersonContext();
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    setUrl(link?.url || '');
    setText((link && link.text !== link.url && link.text) || '');
  }, [link]);

  function handleUrlChange(newUrl) {
    setUrl(newUrl);
    if (addingNew && text.trim() === '') {
      setText(getLinkTextFromUrl(newUrl));
    }
  }

  async function handleConfirm() {
    const requestBody = {
      action: addingNew ? 'add' : 'edit',
      index: editingIndex,
      url: url.trim(),
      text: text.trim(),
    };

    await api(`people/${personId}/links`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    clearFormAndCloseModal();
    refetchPerson();
  }

  function clearFormAndCloseModal() {
    setUrl('');
    setText('');
    closeModal?.();
  }

  const isValid = url.trim() !== '';

  // When adding a new link, the modal is opened by the built-in modal trigger button.
  // When editing a link, the modal is opened by a button in the list of links, outside
  // of this component, so open is always true.
  const modalIsOpen = addingNew ? undefined : true;

  return (
    <Modal
      title={addingNew ? 'Add Link' : 'Edit Link'}
      onConfirm={handleConfirm}
      confirmEnabled={isValid}
      onCancel={clearFormAndCloseModal}
      triggerButtonLabel={addingNew ? 'Add Link' : undefined}
      open={modalIsOpen}
    >
      <Input
        value={url}
        onChange={handleUrlChange}
        textarea
        style={{ height: '80px' }}
        placeholder="URL"
      />
      <br />
      <Input value={text} onChange={setText} placeholder="display text" />
    </Modal>
  );
}

function DeleteLinkModal({ deleteIndex, link, closeModal }) {
  const { personId, refetch: refetchPerson } = usePersonContext();

  async function handleConfirm() {
    const requestBody = {
      action: 'delete',
      index: deleteIndex,
    };

    await api(`people/${personId}/links`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    closeModal();
    refetchPerson();
  }

  return (
    <Modal
      title="Delete link?"
      open
      onConfirm={handleConfirm}
      onCancel={closeModal}
    >
      {link.url} {link.url !== link.text && link.text}
    </Modal>
  );
}

function MissingItemsSection() {
  const { person } = usePersonContext();

  const missingAncestry = !person.links.some(link =>
    link.url.match(/ancestry.com/i),
  );
  const missingFamilySearch = !person.links.some(link =>
    link.url.match(/familysearch.org/i),
  );
  const missingFindAGrave = !person.links.some(link =>
    link.url.match(/findagrave.com/i),
  );
  const missingWikiTree = !person.links.some(link =>
    link.url.match(/wikitree.com/i),
  );

  if (
    !missingAncestry &&
    !missingFamilySearch &&
    !missingFindAGrave &&
    !missingWikiTree
  ) {
    return null;
  }

  return (
    <>
      <Spacer />
      <h2>missing items</h2>
      {missingAncestry && <MissingItemForm text="Ancestry" />}
      {missingFamilySearch && <MissingItemForm text="FamilySearch" />}
      {missingFindAGrave && <MissingItemForm text="FindAGrave" />}
      {missingWikiTree && <MissingItemForm text="WikiTree" />}
    </>
  );
}

function MissingItemForm({ text }) {
  const { personId, refetch: refetchPerson } = usePersonContext();

  const [url, setUrl] = useState('');

  async function handleConfirm(e) {
    e.preventDefault();

    const requestBody = {
      action: 'add',
      url: url.trim(),
      text,
    };

    await api(`people/${personId}/links`, {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    refetchPerson();
  }

  const isValid = url.trim() !== '';

  return (
    <form
      style={{ display: 'block', margin: '10px 0' }}
      onSubmit={handleConfirm}
    >
      <Input value={url} onChange={setUrl} placeholder={text} />
      <Button disabled={!isValid}>Add</Button>
    </form>
  );
}

function getLinkTextFromUrl(url) {
  if (url.match(/ancestry.com/i)) {
    return 'Ancestry';
  }
  if (url.match(/familysearch.org/i)) {
    return 'FamilySearch';
  }
  if (url.match(/facebook.com/i)) {
    return 'Facebook profile';
  }
  if (url.match(/findagrave.com/i)) {
    return 'FindAGrave';
  }
  if (url.match(/newspapers.com/i)) {
    return 'Newspapers.com';
  }
  if (url.match(/wikitree.com/i)) {
    return 'WikiTree';
  }
  return '';
}
