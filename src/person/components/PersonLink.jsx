import React from 'react';
import { Link } from 'react-router-dom';

export default function PersonLink({ person }) {
  const personProfileUrl = `/person/${person.id}`;
  return <Link to={personProfileUrl}>{person.name}</Link>;
}
