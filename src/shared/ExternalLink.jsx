import React from 'react';
import { Link } from 'react-router-dom';

export default function ExternalLink({ to, children }) {
  return (
    <Link to={to} target="_blank">
      {children}{' '}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
        fill="currentColor"
      >
        <path d="M14 3h7a1 1 0 0 1 1 1v7a1 1 0 1 1-2 0V5.41l-9.29 9.3a1 1 0 0 1-1.42-1.42l9.3-9.29H15a1 1 0 1 1 0-2zm3 12a1 1 0 0 1 1 1v3a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3h3a1 1 0 1 1 0 2H5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-3a1 1 0 0 1 1-1z" />
      </svg>
    </Link>
  );
}
