import React from 'react';

const MONTH_NAME = [
  null, 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// TO DO: finish making this
function FormatDate({date}) {
  if (!date) {
    return null;
  }
  if (!date.month && !date.day && date.year) {
    return date.year;
  }
  return (
    <>
      {MONTH_NAME[date.month]} {date.day}, {date.year}
    </>
  );
}

export default FormatDate;

