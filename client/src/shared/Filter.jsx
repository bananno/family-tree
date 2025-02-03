import React from 'react';

import { useFilter } from 'shared/FilterContext';
import Input from 'shared/form/Input';

import classes from './Filter.module.scss';

export default function Filter({ filterId }) {
  const { filters, setFilterContent } = useFilter();

  const value = filters[filterId]?.content || '';

  return (
    <div className={classes.Filter}>
      <Input
        value={value}
        placeholder="filter"
        onChange={value => setFilterContent(filterId, value)}
      />
      {value && (
        <button onClick={() => setFilterContent(filterId, '')}>&#10006;</button>
      )}
    </div>
  );
}
