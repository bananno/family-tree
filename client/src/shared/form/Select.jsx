import React from 'react';

import formClasses from './form.module.scss';

export default function Select({
  disabled,
  register,
  name,
  rules,
  children,
  onChange,
  value,
}) {
  const fieldRegister = register ? register(name, rules) : {};

  function handleChange(event) {
    if (onChange) {
      onChange(event.target.value);
    }
  }

  return (
    <select
      className={formClasses.Select}
      disabled={disabled}
      onChange={handleChange}
      value={value}
      {...fieldRegister}
    >
      {children}
    </select>
  );
}
