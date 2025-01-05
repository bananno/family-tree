import React from 'react';

import formClasses from './form.module.scss';

export default function Input({
  value,
  onChange,
  textarea = false,
  placeholder,
}) {
  if (textarea) {
    return (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={formClasses.Input}
      />
    );
  }
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      type={type || 'text'}
      placeholder={placeholder}
      className={formClasses.Input}
    />
  );
}
