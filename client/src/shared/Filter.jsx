import React, { useState } from 'react';

import { useFilter } from 'shared/FilterContext';
import Input from 'shared/form/Input';

export default function Filter({ filterId, onChange }) {
  if (onChange || !filterId) {
    console.warn('Deprecated usage of Filter component');
  }

  const [value, setValue] = useState('');
  const { setFilterContent } = useFilter();

  function handleFilterChange(newValue) {
    // onChange = the old version, phase out in favor of setFilterContent
    onChange?.(
      newValue
        .trim()
        .split(' ')
        .filter(Boolean)
        .map(word => RegExp(word, 'i')),
    );

    setValue(newValue);

    if (filterId) {
      setFilterContent(filterId, newValue);
    }
  }

  return (
    <Input value={value} placeholder="filter" onChange={handleFilterChange} />
  );
}
