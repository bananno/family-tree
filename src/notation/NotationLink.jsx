import React from 'react';
import {Link} from 'react-router-dom';

function NotationLInk({notation}) {
  const notationProfileUrl = `/notation/${notation.id}`;
  return (
    <Link to={notationProfileUrl}>{notation.title || '(empty)'}</Link>
  );
}

export default NotationLInk;
