import React from 'react';

// TO DO: finish making this

// "location" is a global variable
function FormatLocation({ location: loc }) {
  if (!loc) {
    return null;
  }
  return (
    <>
      {loc.city} {loc.region2} {loc.region1} {loc.country} {loc.notes}
    </>
  );
}

export default FormatLocation;
