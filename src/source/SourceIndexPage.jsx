import React, {useState} from 'react';
import {Link, useParams} from 'react-router-dom';

import Filter from '../Filter';
import SourceLink from './SourceLink';
import useSourceList from '../hooks/useSourceList';

const mainSourceTypes = [
  'document', 'index', 'cemetery', 'newspaper',
  'photo', 'website', 'book', 'other'
];

function SourceIndexPage() {
  const {sourceType} = useParams();
  const {sources, isLoading} = useSourceList({sourceType});
  const [filterWords, setFilterWords] = useState([]);

  const filteredSources = filterWords.length > 0
    ? sources.filter((source, i) => !filterWords.some(word => !word.test(source.fullTitle)))
    : sources;

  return (
    <div>
      <h2>sources</h2>
      <ul>
        <li><Link to="/sources">all</Link></li>
        {mainSourceTypes.map(sourceType => (
          <li key={sourceType}>
            <Link to={`/sources/${sourceType}`}>{sourceType}</Link>
          </li>
        ))}
      </ul>
      {isLoading && <p>loading...</p>}
      <Filter onChange={setFilterWords}/>
      <ul>
        {filteredSources.map(source => (
          <li key={source.id}>
            <SourceLink source={source}/>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SourceIndexPage;
