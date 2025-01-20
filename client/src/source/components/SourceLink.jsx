import React from 'react';
import { Link } from 'react-router-dom';

export default function SourceLink({ children, source, useFullTitle = true }) {
  const sourceProfileUrl = `/source/${source.id}`;
  const content = children || (useFullTitle ? source.fullTitle : source.title);
  return <Link to={sourceProfileUrl}>{content}</Link>;
}
