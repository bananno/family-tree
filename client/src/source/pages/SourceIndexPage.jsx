import React from 'react';
import { Link, useParams } from 'react-router-dom';

import BulletList from 'shared/BulletList';
import Filter from 'shared/Filter';
import SourceLink from 'source/components/SourceLink';
import useSourceList from 'source/hooks/useSourceList';

const mainSourceTypes = [
  'document',
  'index',
  'cemetery',
  'newspaper',
  'photo',
  'website',
  'book',
  'other',
];

const filterId = 'FILTER_SOURCE_INDEX_PAGE';

export default function SourceIndexPage() {
  const { sourceType } = useParams();
  const { sources, isLoading } = useSourceList({ sourceType, filterId });

  return (
    <>
      <h1>Sources</h1>
      <BulletList>
        <li>
          <Link to="/sources">all</Link>
        </li>
        {mainSourceTypes.map(sourceType => (
          <li key={sourceType}>
            <Link to={`/sources/${sourceType}`}>{sourceType}</Link>
          </li>
        ))}
      </BulletList>
      {isLoading && <p>loading...</p>}
      <Filter filterId={filterId} />
      <BulletList>
        {sources.map(source => (
          <li key={source.id}>
            <SourceLink source={source} />
          </li>
        ))}
      </BulletList>
    </>
  );
}
