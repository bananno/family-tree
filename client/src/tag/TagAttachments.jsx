import React, { useState } from 'react';

import api from 'shared/api';
import Divider from 'shared/Divider';
import Button from 'shared/form/Button';
import Modal from 'shared/Modal';
import Spacer from 'shared/Spacer';
import TagAttachmentModal from 'tag/components/TagAttachmentModal';
import TagItem from 'tag/components/TagItem';
import TagList from 'tag/components/TagList';

// Display and edit attached tags for any model.
export default function TagAttachments({ modelName, subject, refetch }) {
  const tagAttachments = subject.tags;

  const [editing, setEditing] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  async function sendTagUpdate(action, tagChangeDetails, onComplete) {
    await api('tag-attachments', {
      method: 'POST',
      body: JSON.stringify({
        modelName,
        id: subject.id,
        action,
        ...tagChangeDetails,
      }),
      catchPlease: true,
    });

    onComplete?.();
    refetch();
  }

  function handleCreate(tagId, tagValue) {
    sendTagUpdate('add', { tagId, tagValue });
  }

  function handleDelete() {
    sendTagUpdate('delete', { index: deleteIndex }, () => setDeleteIndex(null));
  }

  function handleEdit(tagValue) {
    sendTagUpdate('edit', { index: editIndex, tagValue }, () =>
      setEditIndex(null),
    );
  }

  function handleReorder(reorderIndex) {
    sendTagUpdate('reorder', { index: reorderIndex });
  }

  return (
    <>
      <h2>Tags</h2>
      {editing ? (
        <>
          <Spacer />
          {tagAttachments.map((tagAttachment, index) => (
            <div key={index}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  margin: '10px 0',
                }}
              >
                <div style={{ flex: '3' }}>
                  <TagItem tag={tagAttachment} />
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
                    onClick={() => setDeleteIndex(index)}
                  >
                    &#10006;
                  </Button>
                  <Button
                    style={{ marginLeft: '5px' }}
                    onClick={() => setEditIndex(index)}
                    disabled={
                      !tagAttachment.expectsValue && !tagAttachment.value
                    }
                  >
                    edit value
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <Button
            onClick={() => setEditing(false)}
            style={{ marginRight: '5px' }}
          >
            Done
          </Button>
        </>
      ) : (
        <>
          <TagList tags={tagAttachments} />
          <Divider />
          <Button
            onClick={() => setEditing(true)}
            style={{ marginRight: '5px' }}
          >
            Edit
          </Button>
        </>
      )}
      <TagAttachmentModal
        tagAttachments={tagAttachments}
        modelName={modelName}
        onSubmit={handleCreate}
      />
      {editIndex !== null && (
        <TagAttachmentModal
          tagAttachment={tagAttachments[editIndex]}
          onSubmit={handleEdit}
          onCancel={() => setEditIndex(null)}
        />
      )}
      {deleteIndex !== null && (
        <Modal
          title="Delete tag?"
          open
          onConfirm={handleDelete}
          onCancel={() => setDeleteIndex(null)}
        >
          <TagItem tag={tagAttachments[deleteIndex]} />
        </Modal>
      )}
    </>
  );
}
