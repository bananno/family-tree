import React from 'react';

import classes from './FormatContent.module.scss';

function FormatContent({content = ''}) {
  const contentPieces = content.split('\n');

  const contentComponents = [];

  // TO DO: add more edge cases and formatting options here
  for (let i = 0; i < contentPieces.length; i++) {
    const nextLine = contentPieces[i];

    if (lineIsPartOfTable(nextLine)) {
      const tableLines = [nextLine];
      while (i < contentPieces.length - 1 && lineIsPartOfTable(contentPieces[i + 1])) {
        tableLines.push(contentPieces[i + 1]);
        i += 1;
      }
      contentComponents.push(<FormatContentTable key={i} tableLines={tableLines}/>);
    } else {
      contentComponents.push(<p key={i}>{nextLine}</p>);
    }
  }

  return (
    <div className={classes.FormatContent}>
      {contentComponents}
    </div>
  );
}

function FormatContentTable({tableLines}) {
  return (
    <table>
      <tbody>
        {tableLines.map((contentRow, i) => (
          <FormatContentTableRow key={i} contentRow={contentRow}/>
        ))}
      </tbody>
    </table>
  );
}

function FormatContentTableRow({contentRow}) {
  let remainingRow = contentRow;
  let key = 0;
  const tableCellComponents = [];
  
  while (remainingRow.length) {
    let isHeader = false;
    remainingRow = remainingRow.slice(1);

    if (remainingRow.length && remainingRow.slice(0, 1) == '\|') {
      isHeader = true;
      remainingRow = remainingRow.slice(1);
    }

    remainingRow = remainingRow.trim();
    let cellContent;
    const nextCellIndex = remainingRow.indexOf('\|');

    if (nextCellIndex >= 0) {
      cellContent = remainingRow.slice(0, nextCellIndex);
      remainingRow = remainingRow.slice(nextCellIndex);
    } else {
      cellContent = remainingRow;
      remainingRow = '';
    }

    if (isHeader) {
      tableCellComponents.push(<th key={key}>{cellContent}</th>);
    } else {
      tableCellComponents.push(<td key={key}>{cellContent}</td>);
    }

    key += 1;
  }

  return (<tr>{tableCellComponents}</tr>);
}

function lineIsPartOfTable(str) {
  return str !== null && str.length > 0 && str.slice(0, 1) == '\|';
}

export default FormatContent;

