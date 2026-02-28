import clsx from 'clsx';
import React, { forwardRef } from 'react';

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
        className={clsx(
          'w-[400px] h-[150px] border border-gray-300 rounded px-3 py-2',
          'text-sm bg-white focus:outline-none focus:border-gray-500',
        )}
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
      className={clsx(
        'w-[400px] border border-gray-300 rounded px-3 py-2',
        'text-sm bg-white focus:outline-none focus:border-gray-500',
      )}
      style={style}
      {...fieldRegister}
    />
  );
});
