import clsx from 'clsx';
import React from 'react';

export default function Button({
  disabled,
  onClick,
  text,
  children,
  style = {},
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
    <button
      className={clsx(
        'px-5 py-2 text-sm rounded border border-gray-400 bg-gray-100 cursor-pointer',
        'hover:bg-gray-200 hover:border-gray-500 disabled:opacity-50 disabled:cursor-not-allowed',
      )}
      onClick={handleClick}
      disabled={disabled}
      style={style}
    >
      {text}
      {children}
    </button>
  );
}
