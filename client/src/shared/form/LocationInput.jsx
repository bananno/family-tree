import React, { useState } from 'react';
import ReactSelect from 'react-select';

import Input from 'shared/form/Input';

import formClasses from './form.module.scss';

export default function LocationInput({ value = {}, onChange }) {
  const defaultSelectedCountry = (value.country
    ? COUNTRY_OPTIONS.find(country => country.value === value.country)
    : null) || { value: 'other', label: 'other' };

  const [selectedCountry, setSelectedCountry] = useState(
    defaultSelectedCountry,
  );

  const selectedUSA = selectedCountry?.value === 'United States';
  const showOtherCountry = selectedCountry?.value === 'other';

  // Hide the city and county for the United States unless a state is selected.
  // For other countries, all fields are available.
  const showRegion2AndCity = !selectedUSA || !!value.region1;

  const selectedState =
    (selectedUSA &&
      USA_STATE_OPTIONS.find(state => state.value === value.region1)) ||
    null;

  function handleSelectedCountryChange(newCountry) {
    setSelectedCountry(newCountry);

    const newValue = { ...value };

    if (newCountry?.value === 'other') {
      newValue.country = '';
    } else {
      newValue.country = newCountry.value;
    }

    // If switched to USA and the existing region1 value is not a valid state, clear the
    // value to support the select input. (And clear city/county because those require a
    // state first.) Otherwise no change needed.
    if (
      newValue.country === 'United States' &&
      value.region1 &&
      !USA_STATE_OPTIONS.map(opt => opt.value).includes(value.region1)
    ) {
      newValue.region1 = '';
      newValue.region2 = '';
      newValue.city = '';
    }

    onChange(newValue);
  }

  return (
    <div className={formClasses.LocationInput}>
      <ReactSelect
        options={COUNTRY_OPTIONS}
        value={selectedCountry}
        onChange={handleSelectedCountryChange}
        closeMenuOnSelect
      />
      {showOtherCountry && (
        <Input
          value={value.country || ''}
          onChange={country => onChange({ ...value, country })}
          placeholder="country"
        />
      )}
      {selectedUSA ? (
        <ReactSelect
          options={USA_STATE_OPTIONS}
          value={selectedState}
          onChange={option => onChange({ ...value, region1: option.value })}
          closeMenuOnSelect
          placeholder="state"
        />
      ) : (
        <Input
          value={value.region1 || ''}
          onChange={region1 => onChange({ ...value, region1 })}
          placeholder="wider region (province, state, etc.)"
        />
      )}
      {showRegion2AndCity && (
        <>
          <Input
            value={value.region2 || ''}
            onChange={region2 => onChange({ ...value, region2 })}
            placeholder={
              selectedUSA ? 'county' : 'smaller region (county, etc.)'
            }
          />
          <Input
            value={value.city || ''}
            onChange={city => onChange({ ...value, city })}
            placeholder="city"
          />
        </>
      )}
      <Input
        value={value.notes || ''}
        onChange={notes => onChange({ ...value, notes })}
        placeholder="notes (street address, etc.)"
      />
    </div>
  );
}

////////////////////

const COUNTRY_OPTIONS = [
  'Czech Republic',
  'Denmark',
  'Holland',
  'Ireland',
  'Sweden',
  'United States',
  'other',
].map(country => ({
  value: country,
  label: country,
}));

const USA_STATE_OPTIONS = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];
