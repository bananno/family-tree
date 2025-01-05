import React from 'react';
import { Link } from 'react-router-dom';

export default function SourceLink({ source, useFullTitle = true }) {
  const sourceProfileUrl = `/source/${source.id}`;
  const text = useFullTitle ? source.fullTitle : source.title;
  return <Link to={sourceProfileUrl}>{text}</Link>;
}
