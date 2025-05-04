import React from 'react';

import formClasses from './form.module.scss';

export default function FormSection({ label, children }) {
  return (
    <div className={formClasses.FormSection}>
      {label && <label>{label}</label>}
      {children}
    </div>
  );
}
