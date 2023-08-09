import React, {useState} from 'react';

function Filter({onChange}) {
  const [value, setValue] = useState('');

  function handleFilterChange(event) {
    onChange(
      event.target.value
        .trim()
        .split(' ')
        .filter(Boolean)
        .map(word => RegExp(word, 'i'))
    );
    setValue(event.target.value);
  }

  return (
    <input value={value} placeholder="filter" onChange={handleFilterChange}/>
  );
}

export default Filter;

