import React from 'react';
import { Link } from 'react-router-dom';

import BulletList from 'shared/BulletList';

// List of external links with "url" and "text" properties.
export default function LinkList({ links }) {
  return (
    <BulletList>
      {links.map(link => (
        <li key={link.url}>
          <FormattedLink link={link} />
        </li>
      ))}
    </BulletList>
  );
}

// Single external link with "url" and "text" properties.
export function FormattedLink({ link }) {
  return (
    <Link to={link.url} target="_blank">
      {link.text}
    </Link>
  );
}
