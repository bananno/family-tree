import React from 'react';

import formClasses from './form.module.scss';

export default function FormSection({ label, children, style = {} }) {
  return (
    <div className={formClasses.FormSection} style={style}>
      {label && <label>{label}</label>}
      {children}
    </div>
  );
}
