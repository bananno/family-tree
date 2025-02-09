import React, { forwardRef } from 'react';

import formClasses from './form.module.scss';

export default forwardRef(
  ({ value, onChange, textarea = false, placeholder, style = {} }, ref) => {
    if (textarea) {
      return (
        <textarea
          value={value}
          ref={ref}
          onChange={e => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={formClasses.Input}
          style={style}
        />
      );
    }

    return (
      <input
        value={value}
        onChange={e => onChange?.(e.target.value)}
        ref={ref}
        type="text"
        placeholder={placeholder}
        className={formClasses.Input}
        style={style}
      />
    );
  },
);
