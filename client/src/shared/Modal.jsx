import React, { useEffect, useState } from 'react';

import Button from 'shared/form/Button';

import modalClasses from './Modal.module.scss';

export default function Modal({
  title,
  open,
  confirmEnabled = true,
  triggerEnabled = true,
  onConfirm,
  onCancel,
  onOpen,
  confirmButtonLabel = 'Confirm',
  cancelButtonLabel = 'Cancel',
  triggerButtonLabel = 'Open modal',
  children,
}) {
  const [managedOpen, setManagedOpen] = useState(false);

  const openStateManagedExternally = open !== undefined;
  const isModalOpen = openStateManagedExternally ? open : managedOpen;

  useEffect(() => {
    if (isModalOpen) {
      // If onOpen were attached to the button click itself, it would be
      // called before the modal re-render, and the modal children wouldn't
      // exist yet. Inside useEffect, it will be called after the modal re-renders,
      // so the children will be available, e.g., for focusing an input.
      onOpen?.();
    }
  }, [isModalOpen]);

  async function handleFormSubmit(event) {
    event?.preventDefault();

    if (!confirmEnabled) {
      return;
    }

    // Don't treat this as a form submission (close the modal) unless
    // there is actually a confirm handler.
    if (onConfirm) {
      handleConfirm();
    }
  }

  async function handleConfirm() {
    const result = await onConfirm();
    if (result !== false) {
      setManagedOpen(false);
    }
  }

  function handleCancel() {
    setManagedOpen(false);
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
      {!openStateManagedExternally && (
        <Button
          onClick={() => setManagedOpen(true)}
          disabled={!triggerEnabled}
          text={triggerButtonLabel}
        />
      )}
      {isModalOpen && (
        <div className={modalClasses.Modal} onClick={onClickBackdrop}>
          <div className={modalClasses.modalContent}>
            <h2>{title}</h2>
            <form onSubmit={handleFormSubmit}>{children}</form>
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
