import React, { useEffect, useState } from 'react';

import Button from 'shared/form/Button';

import modalClasses from './Modal.module.scss';

export default function Modal({
  title,
  open,
  confirmEnabled = true,
  triggerEnabled = true,
  handleSubmit,
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

    if (!confirmEnabled || !onConfirm) {
      return;
    }

    let result;

    // When using react-hook-form, the handleSubmit function can be passed as a prop
    // instead of wrapping the onConfirm in the parent component. This allows the modal
    // to handle the wrapping in order to capture the response from onConfirm and decide
    // whether to close after submission.
    if (handleSubmit) {
      await handleSubmit(async data => {
        result = await onConfirm(data);
      })();
    } else {
      result = await onConfirm();
    }

    // The onConfirm prop can return a boolean to indicate whether the modal should
    // close. By default, close the modal after submission. Return false to keep it open.
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
            <form onSubmit={handleFormSubmit}>
              {children}
              <div className={modalClasses.modalActions}>
                {onConfirm && (
                  <Button
                    onClick={handleFormSubmit}
                    disabled={!confirmEnabled}
                    text={confirmButtonLabel}
                    type="submit"
                  />
                )}
                <Button
                  onClick={handleCancel}
                  variant="cancel"
                  text={cancelButtonLabel}
                />
              </div>
            </form>
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
