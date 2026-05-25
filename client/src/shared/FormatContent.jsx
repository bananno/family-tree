import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

import classes from './FormatContent.module.scss';

// This component is only for "content" data. For anything else, use the Markdown component.
// children = pass raw content (newer version)
// content = array of lines of content (older version, to be phased out)
export default function FormatContent({
  markdown,
  children,
  content: contentProp,
}) {
  if (markdown) {
    if (contentProp !== undefined) {
      throw new Error('FormatContent: pass children as raw content string');
    }

    return (
      <div className="space-y-4">
        <ReactMarkdown remarkPlugins={[remarkBreaks]}>{children}</ReactMarkdown>
      </div>
    );
  }

  const content = contentProp || children.split('\n') || [];

  const contentComponents = [];

  // TO DO: add more edge cases and formatting options here
  for (let i = 0; i < content.length; i++) {
    const nextLine = content[i];

    if (lineIsPartOfTable(nextLine)) {
      const tableLines = [nextLine];
      while (i < content.length - 1 && lineIsPartOfTable(content[i + 1])) {
        tableLines.push(content[i + 1]);
        i += 1;
      }
      contentComponents.push(
        <FormatContentTable key={i} tableLines={tableLines} />,
      );
    } else {
      contentComponents.push(<p key={i}>{nextLine}</p>);
    }
  }

  return <div className={classes.FormatContent}>{contentComponents}</div>;
}

////////////////////

function FormatContentTable({ tableLines }) {
  return (
    <table>
      <tbody>
        {tableLines.map((contentRow, i) => (
          <FormatContentTableRow key={i} contentRow={contentRow} />
        ))}
      </tbody>
    </table>
  );
}

function FormatContentTableRow({ contentRow }) {
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

  return <tr>{tableCellComponents}</tr>;
}

function lineIsPartOfTable(str) {
  return str !== null && str.length > 0 && str.slice(0, 1) == '\|';
}
