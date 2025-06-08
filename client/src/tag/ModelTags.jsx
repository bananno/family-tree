import React, { createContext, useContext, useState } from 'react';

import api from 'shared/api';
import Divider from 'shared/Divider';
import Button from 'shared/form/Button';
import FormSection from 'shared/form/FormSection';
import Input from 'shared/form/Input';
import Modal from 'shared/Modal';
import Spacer from 'shared/Spacer';
import NewTagAttachmentModal from 'tag/components/NewTagAttachmentModal';
import TagItem from 'tag/components/TagItem';
import TagList from 'tag/components/TagList';

const ModelTagsContext = createContext({});

function ModelTagsProvider({ children, ...props }) {
  return (
    <ModelTagsContext.Provider value={props}>
      {children}
    </ModelTagsContext.Provider>
  );
}

// Display and edit attached tags for any model.
export default function ModelTags({
  editTagRoutePath,
  modelName,
  refetch,
  tags = [],
}) {
  const [editing, setEditing] = useState(false);

  async function sendTagUpdate(requestBody) {
    await api(editTagRoutePath, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      catchPlease: true,
    });

    refetch();
  }

  function onCreateAttachment({ tagId, tagValue }) {
    sendTagUpdate({ action: 'add', tagId, tagValue });
  }

  const context = {
    modelName,
    sendTagUpdate,
    tags,
  };

  return (
    <ModelTagsProvider {...context}>
      <h2>Tags</h2>
      {editing ? (
        <EditTagsSection onDone={() => setEditing(false)} />
      ) : (
        <>
          <TagList tags={tags} />
          <Divider />
          <Button
            onClick={() => setEditing(true)}
            style={{ marginRight: '5px' }}
          >
            Edit
          </Button>
        </>
      )}
      <NewTagAttachmentModal
        attachedTags={tags}
        modelName={modelName}
        onSubmit={onCreateAttachment}
      />
    </ModelTagsProvider>
  );
}

////////////////////

function EditTagsSection({ onDone }) {
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const { sendTagUpdate, tags } = useContext(ModelTagsContext);

  async function handleConfirmDelete() {
    await sendTagUpdate({
      action: 'delete',
      index: deletingIndex,
    });

    setDeletingIndex(null);
  }

  async function handleReorder(reorderIndex) {
    await sendTagUpdate({
      action: 'reorder',
      index: reorderIndex,
    });
  }

  return (
    <>
      <Spacer />
      {tags.map((tag, index) => (
        <div key={index}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              margin: '10px 0',
            }}
          >
            <div style={{ flex: '3' }}>
              <TagItem tag={tag} />
            </div>
            <div style={{ flex: '1' }}>
              <Button
                style={{
                  marginLeft: '5px',
                  visibility: index === 0 ? 'hidden' : 'visible',
                }}
                onClick={() => handleReorder(index)}
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
                disabled={!tag.expectsValue}
              >
                edit value
              </Button>
            </div>
          </div>
        </div>
      ))}
      <Button onClick={onDone} style={{ marginRight: '5px' }}>
        Done
      </Button>
      {deletingIndex !== null && (
        <Modal
          title="Delete tag?"
          open
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeletingIndex(null)}
        >
          <TagItem tag={tags[deletingIndex]} />
        </Modal>
      )}
      {editingIndex !== null && (
        <EditTagAttachmentValue
          index={editingIndex}
          tag={tags[editingIndex]}
          onClose={() => setEditingIndex(null)}
        />
      )}
    </>
  );
}

function EditTagAttachmentValue({ index, tag, onClose }) {
  const { sendTagUpdate } = useContext(ModelTagsContext);
  const [value, setValue] = useState(tag.value || '');

  async function handleConfirm() {
    await sendTagUpdate({
      action: 'edit',
      index,
      tagValue: value.trim(),
    });
    onClose();
  }

  const isValid = value.trim().length > 0;

  return (
    <Modal
      title="Edit tag"
      onConfirm={handleConfirm}
      confirmEnabled={isValid}
      onCancel={onClose}
      open
    >
      <FormSection label="Tag name">{tag.title}</FormSection>
      {tag.definition && (
        <FormSection style={{ width: '500px' }} label="Definition">
          {tag.definition}
        </FormSection>
      )}
      <FormSection label="Value">
        <Input value={value} onChange={setValue} />
      </FormSection>
    </Modal>
  );
}
