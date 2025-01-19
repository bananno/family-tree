import React, { useState } from 'react';

import Input from 'shared/form/Input';

export default function Filter({ onChange }) {
  const [value, setValue] = useState('');

  function handleFilterChange(newValue) {
    onChange(
      newValue
        .trim()
        .split(' ')
        .filter(Boolean)
        .map(word => RegExp(word, 'i')),
    );
    setValue(newValue);
  }

  return (
    <Input value={value} placeholder="filter" onChange={handleFilterChange} />
  );
}
