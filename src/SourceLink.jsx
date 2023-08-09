import React from 'react';
import {Link} from 'react-router-dom';

function SourceLink({source, useFullTitle = true}) {
  const sourceProfileUrl = `/source/${source.id}`;
  const text = useFullTitle ? source.fullTitle : source.title;
  return (
    <Link to={sourceProfileUrl}>{text}</Link>
  );
}

export default SourceLink;
