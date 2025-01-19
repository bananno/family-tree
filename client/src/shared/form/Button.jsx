import React from 'react';

import formClasses from './form.module.scss';

export default function Button({
  disabled,
  onClick,
  text,
  children,
}) {
  function handleClick(e) {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
    // Don't preventDefault if there's no onClick handler.
    // The button needs to be allowed to submit the form.
  }

  return (
    <button className={formClasses.Button} onClick={handleClick} disabled={disabled}>
      {text}
      {children}
    </button>
  );
}
