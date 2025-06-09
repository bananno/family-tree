import React, { useState } from 'react';

import Input from 'shared/form/Input';
import Select from 'shared/form/Select';

import formClasses from './form.module.scss';

const MONTH_NAME = [
  null,
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function DateInput({ value = {}, onChange }) {
  const [quickDate, setQuickDate] = useState('');

  // Given a date string, of any/unknown format, try to extract a
  // year, month, and day.
  function handleQuickDateChange(newDate) {
    setQuickDate(newDate);

    const parts = newDate
      .replace(/[^a-zA-Z0-9 ]/g, ' ')
      .split(' ')
      .filter(Boolean);

    let { year, month, day } = value;

    parts.forEach(part => {
      // 4 digits
      if (/^\d{4}$/.test(part)) {
        year = part;
        return;
      }

      // 1-2 digits, possibly with a leading zero
      if (/^\d{1,2}$/.test(part)) {
        day = part;
        return;
      }

      const matchingMonth = MONTH_NAME.find(
        m => m && m.toLowerCase().startsWith(part.toLowerCase()),
      );

      if (matchingMonth) {
        month = MONTH_NAME.indexOf(matchingMonth);
        return;
      }
    });

    onChange({
      year: year,
      month: month,
      day: day,
      display: value.display,
    });
  }

  return (
    <div className={formClasses.DateInput}>
      <Input
        placeholder="quick date"
        value={quickDate}
        onChange={handleQuickDateChange}
      />
      <div className={formClasses.mainContainer}>
        <Input
          placeholder="year"
          value={value.year || ''}
          onChange={newYear => onChange({ ...value, year: newYear })}
          type="number"
        />
        <Select value={value.month || ''}>
          {MONTH_NAME.map((month, index) => (
            <option value={index} key={month || index}>
              {month || 'month'}
            </option>
          ))}
        </Select>
        <Input
          placeholder="day"
          value={value.day || ''}
          onChange={newDay => onChange({ ...value, day: newDay })}
          type="number"
        />
      </div>
      <Input
        placeholder="alternate display"
        value={value.display || ''}
        onChange={newDisplay => onChange({ ...value, display: newDisplay })}
      />
    </div>
  );
}
