import React from 'react';

import BulletList from '../shared/BulletList';
import SourceLink from './SourceLink';

export default function SourceList({ sources, useFullTitle }) {
  return (
    <BulletList>
      {sources.map(source => (
        <li key={source.id}>
          <SourceLink source={source} useFullTitle={useFullTitle} />
        </li>
      ))}
    </BulletList>
  );
}
