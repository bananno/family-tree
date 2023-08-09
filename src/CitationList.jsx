import React from 'react';

import PersonLink from './person/PersonLink';
import SourceLink from './SourceLink';
import classes from './CitationList.module.scss';

function CitationList({citations, showPerson = true, showSource = true}) {
  let previousPersonId, previousItem1, previousItem2, previousInfo;
  return (
    <table className={classes.CitationList}>
      <thead>
        <tr>
          {showPerson && <th>person</th>}
          <th colSpan="2">item</th>
          <th>information</th>
          {showSource && <th>source</th>}
        </tr>
      </thead>
      <tbody>
        {citations.map((citation, i) => {
          let startPersonSection, startItem1Section, startItem2Section, displayInformationText;

          const personClasses = [classes.borderLeft];
          const itemClasses1 = [];
          const itemClasses2 = [];
          const informationClasses = [];
          const sourceClasses = [classes.borderTop, classes.borderRight];

          if (showPerson) {
            personClasses.push(classes.borderLeft);
            if (previousPersonId !== citation.person.id) {
              previousPersonId = citation.person.id;
              startPersonSection = true;
              personClasses.push(classes.borderTop);
            }
          } else {
            itemClasses1.push(classes.borderLeft);
          }

          if (previousItem1 !== citation.itemPart1 || startPersonSection) {
            previousItem1 = citation.itemPart1;
            startItem1Section = true;
            itemClasses1.push(classes.borderTop);
          }

          if (previousItem2 !== citation.itemPart2 || startItem1Section) {
            previousItem2 = citation.itemPart2;
            startItem2Section = true;
            itemClasses2.push(classes.borderTop);
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
            itemClasses1.push(classes.borderBottom);
            itemClasses2.push(classes.borderBottom);
            informationClasses.push(classes.borderBottom);
            sourceClasses.push(classes.borderBottom);
          }

          // TO DO: split the item column into two pieces (e.g. birth / date)
          return (
            <tr key={citation.id}>
              {showPerson && <td className={personClasses.join(' ')}>
                {startPersonSection && <PersonLink person={citation.person}/>}
              </td>}
              <td className={itemClasses1.join(' ')}>
                {startItem1Section && citation.itemPart1}
              </td>
              <td className={itemClasses2.join(' ')}>
                {startItem2Section && citation.itemPart2}
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
