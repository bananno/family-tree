import React from 'react';

import SourceLink from './SourceLink';
import classes from './CitationList.module.scss';

function CitationList({citations}) {
  let previousItem, previousInfo;
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
          let itemText, infoText;

          const itemClasses = [classes.borderLeft];
          const informationClasses = [];
          const sourceClasses = [classes.borderTop, classes.borderRight];

          if (previousItem !== citation.item) {
            itemText = citation.item;
            previousItem = citation.item;
            itemClasses.push(classes.borderTop);
          }

          if (previousInfo !== citation.information) {
            infoText = citation.information;
            previousInfo = citation.information;
            informationClasses.push(classes.borderTop);
          }

          if (i === citations.length - 1) {
            itemClasses.push(classes.borderBottom);
            informationClasses.push(classes.borderBottom);
            sourceClasses.push(classes.borderBottom);
          }

          return (
            <tr key={citation.id}>
              <td className={itemClasses.join(' ')}>
                {itemText}
              </td>
              <td className={informationClasses.join(' ')}>
                {infoText}
              </td>
              <td className={sourceClasses.join(' ')}>
                <SourceLink source={citation.source}/>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default CitationList;
