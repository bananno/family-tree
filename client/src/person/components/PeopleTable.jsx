import React from 'react';

import PersonLink from 'person/components/PersonLink';
import classes from 'person/person.module.scss';
import Checkmark from 'shared/Checkmark';
import DevOnly from 'shared/DevOnly';
import Table from 'shared/Table';

// showCurrent = the id of the person that is currently in context; used
// for showing the person in their own sibling list.
export default function PeopleTable({
  people = [],
  showTagValues,
  showDates,
  showCurrent,
  getNote,
  smallText,
  mediumIcon,
}) {
  // Props that are only relevant to PersonLink component
  const personLinkProps = { smallText, mediumIcon };

  return (
    <Table>
      <thead>
        <tr>
          <th>name</th>
          <DevOnly>
            <th>sharing</th>
          </DevOnly>
        </tr>
      </thead>
      <tbody>
        {people.map(person => (
          <tr key={person.id}>
            <td>
              <PersonLink
                person={person}
                alreadySelected={person.id === showCurrent}
                {...personLinkProps}
              />
              {showTagValues && ` - ${person.tagValue}`}
              {getNote && ` ${getNote(person)}`}
              {showDates && (person.birthYear || person.deathYear) && (
                <span className={classes.dates}>
                  {person.birthYear || '?'}-
                  {person.deathYear || (person.living ? 'living' : '?')}
                </span>
              )}
            </td>
            <DevOnly>
              <td>
                {person.shareLevel === 1 ? (
                  'limited'
                ) : (
                  <Checkmark value={person.shareLevel === 2} />
                )}
              </td>
            </DevOnly>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
