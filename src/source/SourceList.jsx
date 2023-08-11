import React from 'react';

import SourceLink from './SourceLink';

function SourceList({sources, useFullTitle}) {
  return (
    <ul>
      {sources.map(source => (
        <li key={source.id}>
          <SourceLink source={source} useFullTitle={useFullTitle}/>
        </li>
      ))}
    </ul>
  );
}

export default SourceList;
