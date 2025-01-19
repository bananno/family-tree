import React from 'react';

import BulletList from 'shared/BulletList';

export default function LinkList({ links }) {
  return (
    <BulletList>
      {links.map(link => (
        <li key={link.url}>
          <a href={link.url} target="_blank">
            {link.text}
          </a>
        </li>
      ))}
    </BulletList>
  );
}
