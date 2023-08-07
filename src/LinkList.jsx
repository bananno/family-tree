import React from 'react';

function LinkList({links}) {
  return (
    <ul>
      {links.map(link => (
        <li key={link.url}>
          <a href={link.url} target="_blank">{link.text}</a>
        </li>
      ))}
    </ul>
  );
}

export default LinkList;
