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
export default function FormatLocation({
  location: loc,
  v2 = false,
  stateOnly = false,
  variant = null,
}) {
  if (!loc) {
    return null;
  }

  if (variant === 'full') {
    if (loc.notes) {
      return (
        <span>
          <FormatLocationFull location={loc} />
          <span className="block">{loc.notes}</span>
        </span>
      );
    }
    return <FormatLocationFull location={loc} />;
  }

  // More for creating section titles than for actually display item locations.
  if (stateOnly) {
    return stateNames[loc.region1];
  }

  // "Auburn Nemaha County NE United States" -> "Auburn, Nebraska"
  if (v2 && loc.country === 'United States') {
    const stateName = stateNames[loc.region1];

    if (stateName && loc.city) {
      return [loc.city, stateName].join(', ');
    }

    if (stateName && loc.region2) {
      return [loc.region2, stateName].join(', ');
    }
  }

  return (
    <>
      {loc.city} {loc.region2} {loc.region1} {loc.country} {loc.notes}
    </>
  );
}

////////////////////

// If non-USA: "City, County, State, Country"
// If USA and state is present: "City, County, State (converted to full)"
// If USA and only country is present: "USA"
// If USA and city/county is present but state is missing: "City, County, "State?", USA"
function FormatLocationFull({ location: loc }) {
  const county = loc.region2;
  const city = loc.city;

  if (loc.country === 'United States') {
    const stateName = stateNames[loc.region1] || loc.region1;

    if (stateName) {
      // Minneapolis, Hennepin County, Minnesota
      return [city, county, stateName].filter(Boolean).join(', ');
    }

    if (city || county) {
      // Minneapolis, Hennepin County, (State?), USA
      return [city, county, '(State?), USA'].filter(Boolean).join(', ');
    }

    return 'USA';
  }

  return [city, county, loc.region1, loc.country].filter(Boolean).join(', ');
}
