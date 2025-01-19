import React from 'react';
import { Link } from 'react-router-dom';

export default function NotationLink({ notation }) {
  const notationProfileUrl = `/notation/${notation.id}`;
  return <Link to={notationProfileUrl}>{notation.title || '(empty)'}</Link>;
}
