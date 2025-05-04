import React from 'react';

import formClasses from './form.module.scss';

export default function Select({ disabled, register, name, rules, children }) {
  const fieldRegister = register ? register(name, rules) : {};

  return (
    <select
      className={formClasses.Select}
      disabled={disabled}
      {...fieldRegister}
    >
      {children}
    </select>
  );
}
