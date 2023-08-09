import React from 'react';

import SourceLink from './SourceLink';
import useSourceList from '../hooks/useSourceList';

function SourceIndexPage() {
  const {sources, isLoading} = useSourceList();

  return (
    <div>
      <h2>sources</h2>
      {isLoading && <p>loading...</p>}
      <ul>
        {sources.map(source => {
          const sourceProfileUrl = `/source/${source.id}`;
          return (
            <li key={source.id}>
              <SourceLink to={sourceProfileUrl} source={source}/>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SourceIndexPage;
