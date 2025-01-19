import React from 'react';

import useChecklistData from 'checklist/hooks/useChecklistData';
import PersonLink from 'person/components/PersonLink';
import Checkmark from 'shared/Checkmark';
import globalClasses from 'shared/global.module.scss';

export default function ChecklistPersonVitalsPage() {
  const { data, isLoading } = useChecklistData('vitals');
  if (isLoading) {
    return <h1>loading...</h1>;
  }
  return (
    <div>
      <h1>Checklist: Person Vitals</h1>
      <p>
        <b>Total people:</b> {data.people.length}
      </p>
      <p>
        <b>Birth events missing:</b> {data.countBirthMissing}
      </p>
      <p>
        <b>Death events missing:</b> {data.countDeathMissing}
      </p>
      <table className={globalClasses.Table}>
        <thead>
          <tr>
            <th>name</th>
            <th>birth</th>
            <th>death</th>
            <th>connection</th>
            <th>degree</th>
            <th>sharing</th>
            <th>children</th>
          </tr>
        </thead>
        <tbody>
          {data.people.map(person => (
            <tr key={person.id}>
              <td>
                <PersonLink person={person} />
              </td>
              <td>
                <Checkmark value={person.birthComplete} />
              </td>
              <td>
                {person.living ? (
                  '--'
                ) : (
                  <Checkmark value={person.deathComplete} />
                )}
              </td>
              <td>{person.connectionTitle}</td>
              <td>{person.degree}</td>
              <td>
                {person.shareLevel == 1 ? (
                  'restricted'
                ) : (
                  <Checkmark value={person.shareLevel == 2} />
                )}
              </td>
              <td>
                <TableCellChildren person={person} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

////////////////////

function TableCellChildren({ person }) {
  if (person.showChildrenDone) {
    return <Checkmark value={true} />;
  }
  if (person.showChildrenNotDone) {
    return <Checkmark value={false} />;
  }
  return person.childrenNote;
}
