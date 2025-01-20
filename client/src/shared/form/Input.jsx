import React from 'react';

import formClasses from './form.module.scss';

export default function Input({
  value,
  onChange,
  textarea = false,
  placeholder,
  style = {},
}) {
  if (textarea) {
    return (
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={formClasses.Input}
        style={style}
      />
    );
  }
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      type="text"
      placeholder={placeholder}
      className={formClasses.Input}
      style={style}
    />
  );
}
