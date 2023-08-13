import React from 'react';

import PersonLink from './PersonLink';
import classes from './PersonTree.module.scss';

const PersonTree = ({person}) => {
  return (
    <div className={classes.PersonTreeFrame}>
      <PersonTreeBranch person={person}/>
    </div>
  );
};

const PersonTreeBranch = ({person, safety = 0}) => {
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
            <PersonTreeBranch person={person.treeParents?.[0]} safety={safety + 1}/>
          </td>
          <td valign="bottom">
            <PersonTreeBranch person={person.treeParents?.[1]} safety={safety + 1}/>
          </td>
        </tr>
        <tr>
          <td colspan="2"><PersonTreeCell person={person}/></td>
        </tr>
        </tbody>
    </table>
  );
};

const PersonTreeCell = ({person}) => {
  return (
    <div className={classes.PersonTreeCell}>
      {person ? <PersonLink person={person}/> : '(empty)'}
    </div>
  );
};

export default PersonTree;
