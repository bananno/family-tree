import React, { createContext, useContext, useState } from 'react';

import api from 'shared/api';
import Divider from 'shared/Divider';
import Button from 'shared/form/Button';
import Modal from 'shared/Modal';
import Spacer from 'shared/Spacer';
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
    </ModelTagsProvider>
  );
}

////////////////////

function EditTagsSection({ onDone }) {
  const [deletingIndex, setDeletingIndex] = useState(null);
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
              <Button style={{ marginLeft: '5px' }} disabled>
                edit
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
    </>
  );
}
