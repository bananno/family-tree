import React, { forwardRef } from 'react';

import formClasses from './form.module.scss';

export default forwardRef((props, ref) => {
  const {
    value,
    onChange,
    textarea = false,
    placeholder,
    style = {},
    register,
    name,
    rules,
  } = props;

  const fieldRegister = register ? register(name, rules) : {};

  function handleChange(e) {
    if (onChange) {
      onChange(e.target.value);
    }
  }

  if (textarea) {
    return (
      <textarea
        value={value}
        ref={ref}
        onChange={handleChange}
        placeholder={placeholder}
        className={formClasses.Input}
        style={style}
        {...fieldRegister}
      />
    );
  }

  return (
    <input
      value={value}
      onChange={handleChange}
      ref={ref}
      type="text"
      placeholder={placeholder}
      className={formClasses.Input}
      style={style}
      {...fieldRegister}
    />
  );
});
