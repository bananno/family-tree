import React from 'react';

import PersonLink from './person/PersonLink';
import SourceLink from './SourceLink';
import classes from './CitationList.module.scss';

function CitationList({citations, showPerson = true, showSource = true}) {
  let previousPersonId, previousItem, previousInfo;
  return (
    <table className={classes.CitationList}>
      <thead>
        <tr>
          <th>item</th>
          <th>information</th>
          <th>source</th>
        </tr>
      </thead>
      <tbody>
        {citations.map((citation, i) => {
          let displayPersonLink, displayItemText, displayInformationText;

          const personClasses = [classes.borderLeft];
          const itemClasses = [];
          const informationClasses = [];
          const sourceClasses = [classes.borderTop, classes.borderRight];

          if (showPerson) {
            personClasses.push(classes.borderLeft);
            if (previousPersonId !== citation.person.id) {
              previousPersonId = citation.person.id;
              displayPersonLink = true;
              itemClasses.push(classes.borderTop);
            }
          } else {
            itemClasses.push(classes.borderLeft);
          }

          if (previousItem !== citation.item) {
            previousItem = citation.item;
            displayItemText = true;
            itemClasses.push(classes.borderTop);
          }

          if (previousInfo !== citation.information) {
            previousInfo = citation.information;
            displayInformationText = true;
            informationClasses.push(classes.borderTop);
          }

          if (!showSource) {
            informationClasses.push(classes.borderRight);
          }

          if (i === citations.length - 1) {
            personClasses.push(classes.borderBottom);
            itemClasses.push(classes.borderBottom);
            informationClasses.push(classes.borderBottom);
            sourceClasses.push(classes.borderBottom);
          }

          // TO DO: split the item column into two pieces (e.g. birth / date)
          return (
            <tr key={citation.id}>
              {showPerson && <td className={personClasses.join(' ')}>
                {displayPersonLink && <PersonLink person={citation.person}/>}
              </td>}
              <td className={itemClasses.join(' ')}>
                {displayItemText && citation.item}
              </td>
              <td className={informationClasses.join(' ')}>
                {displayInformationText && citation.information}
              </td>
              {showSource && <td className={sourceClasses.join(' ')}>
                <SourceLink source={citation.source}/>
              </td>}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default CitationList;
