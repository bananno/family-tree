import React, { useEffect, useState } from 'react';

import Button from 'shared/form/Button';

import modalClasses from './Modal.module.scss';

export default function Modal({
  title,
  confirmEnabled = true,
  triggerEnabled = true,
  onConfirm,
  onCancel,
  confirmButtonLabel = 'Confirm',
  cancelButtonLabel = 'Cancel',
  triggerButtonLabel = 'Open modal',
  children,
}) {
  const [modalOpen, setModalOpen] = useState(false);

  async function handleConfirm(event) {
    event?.preventDefault();
    await onConfirm();
    setModalOpen(false);
  }

  function handleCancel() {
    setModalOpen(false);
    onCancel?.();
  }

  useEffect(() => addEscapeKeyListener(handleCancel), [handleCancel]);

  function onClickBackdrop(event) {
    // Only close the modal if the click was on the backdrop, not on the content.
    if (event.target === event.currentTarget) {
      handleCancel();
    }
  }

  return (
    <>
      <Button
        onClick={() => setModalOpen(true)}
        disabled={!triggerEnabled}
        text={triggerButtonLabel}
      />
      {modalOpen && (
        <div className={modalClasses.Modal} onClick={onClickBackdrop}>
          <div className={modalClasses.modalContent}>
            <h2>{title}</h2>
            <form onSubmit={handleConfirm}>{children}</form>
            <div className={modalClasses.modalActions}>
              {onConfirm && (
                <Button
                  onClick={handleConfirm}
                  disabled={!confirmEnabled}
                  text={confirmButtonLabel}
                />
              )}
              <Button
                onClick={handleCancel}
                variant="cancel"
                text={cancelButtonLabel}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

////////////////////

function addEscapeKeyListener(onPressEscape) {
  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      onPressEscape();
    }
  }

  document.addEventListener('keydown', handleKeyDown);

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
}
