import React from 'react';

import PersonLink from 'person/components/PersonLink';

import classes from './PersonTree.module.scss';

export default function PersonTree({ person }) {
  return (
    <div className={classes.PersonTree}>
      <PersonTreeBranch person={person} />
    </div>
  );
}

////////////////////

function PersonTreeBranch({ person, safety = 0 }) {
  if (safety > 30) {
    return 'safety';
  }
  if (!person) {
    return null;
  }
  return (
    <table>
      <tbody>
        <tr>
          <td valign="bottom">
            <PersonTreeBranch
              person={person.treeParents?.[0]}
              safety={safety + 1}
            />
          </td>
          <td valign="bottom">
            <PersonTreeBranch
              person={person.treeParents?.[1]}
              safety={safety + 1}
            />
          </td>
        </tr>
        <tr>
          <td colSpan="2">
            <PersonTreeCell person={person} />
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function PersonTreeCell({ person }) {
  return (
    <div className={classes.PersonTreeCell}>
      {person ? <PersonLink person={person} /> : '(empty)'}
    </div>
  );
}
