import React from 'react';

export default function Select({
  disabled,
  register,
  name,
  rules,
  children,
  onChange,
  value,
  style = {},
}) {
  const fieldRegister = register ? register(name, rules) : {};

  function handleChange(event) {
    if (onChange) {
      onChange(event.target.value);
    }
  }

  return (
    <select
      className="w-[400px] border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-gray-500"
      disabled={disabled}
      onChange={handleChange}
      value={value}
      {...fieldRegister}
      style={style}
    >
      {children}
    </select>
  );
}
