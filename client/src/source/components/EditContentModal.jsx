import { useState } from 'react';

import api from 'shared/api';
import FormatContent from 'shared/FormatContent';
import Modal from 'shared/Modal';

export default function EditContentModal({ source, sourceId, onSave }) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(source.originalContent || '');
  const [useMarkdown, setUseMarkdown] = useState(source.useMarkdown || false);

  function handleReset() {
    setContent(source.originalContent || '');
    setUseMarkdown(source.useMarkdown || false);
  }

  async function handleConfirm() {
    await api(`/sources/${sourceId}`, {
      method: 'PATCH',
      body: { content, useMarkdown },
    });
    setOpen(false);
    onSave();
  }

  return (
    <>
      <a
        className="text-sm font-normal cursor-pointer"
        onClick={() => setOpen(true)}
      >
        edit
      </a>
      <Modal
        title="Edit content"
        open={open}
        confirmButtonLabel="Save"
        onConfirm={handleConfirm}
        onCancel={() => {
          handleReset();
          setOpen(false);
        }}
        onOpen={handleReset}
      >
        <div
          className="flex gap-4"
          style={{ width: '80vw', maxWidth: '1200px' }}
        >
          <div className="flex-1 flex flex-col gap-2">
            <label className="font-bold">Edit</label>
            <textarea
              className="w-full border rounded p-2 font-mono text-sm"
              style={{ minHeight: '400px' }}
              value={content}
              onChange={e => setContent(e.target.value)}
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={useMarkdown}
                onChange={e => setUseMarkdown(e.target.checked)}
              />
              Use markdown
            </label>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <label className="font-bold">Preview</label>
            <div
              className="border rounded p-2 overflow-auto"
              style={{ minHeight: '400px' }}
            >
              <FormatContent markdown={useMarkdown}>{content}</FormatContent>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
