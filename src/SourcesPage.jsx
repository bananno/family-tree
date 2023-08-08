import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

function SourcesPage() {
  const [sources, setSources] = useState([]);

  useEffect(() => {
    fetch('http://localhost:9000/api/source-index')
      .then((res) => res.json())
      .then((res) => {
        setSources(res.data);
      })
      .catch((err) => {
        console.log('ERROR', err.message);
      });
  }, []);

  return (
    <div>
      <h2>sources</h2>
      <ul>
        {sources.map(source => {
          const sourceProfileUrl = `/source/${source.id}`;
          return (
            <li key={source.id}>
              <Link to={sourceProfileUrl}>{source.fullTitle}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SourcesPage;

