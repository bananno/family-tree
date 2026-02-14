import React from 'react';

// TO DO: finish making this

const stateNames = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
};

// "location" is a global variable
function FormatLocation({ location: loc, v2 = false, stateOnly = false }) {
  if (!loc) {
    return null;
  }

  if (stateOnly) {
    return stateNames[loc.region1];
  }

  // "Auburn Nemaha County NE United States" -> "Auburn, Nebraska"
  if (v2) {
    if (
      loc.country === 'United States' &&
      stateNames[loc.region1] &&
      loc.city
    ) {
      return (
        <>
          {loc.city}, {stateNames[loc.region1]}
        </>
      );
    }
  }

  return (
    <>
      {loc.city} {loc.region2} {loc.region1} {loc.country} {loc.notes}
    </>
  );
}

export default FormatLocation;
