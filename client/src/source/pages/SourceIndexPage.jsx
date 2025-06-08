import React from 'react';
import { Link, useParams } from 'react-router-dom';

import BulletList from 'shared/BulletList';
import Checkmark from 'shared/Checkmark';
import Filter from 'shared/Filter';
import FormatDate from 'shared/FormatDate';
import FormatLocation from 'shared/FormatLocation';
import Table from 'shared/Table';
import SourceLink from 'source/components/SourceLink';
import useSources from 'source/hooks/useSources';
import StoryLink from 'story/components/StoryLink';

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
  const { sources, loading } = useSources({ sourceType, filterId });

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
      <Filter filterId={filterId} />
      <Table>
        <thead>
          <tr>
            <th>type</th>
            <th>story</th>
            <th>title</th>
            <th>date</th>
            <th>location</th>
            <th>sharing</th>
          </tr>
        </thead>
        <tbody>
          {sources.map(source => (
            <tr key={source.id}>
              <td>{source.story.type}</td>
              <td>
                <StoryLink story={source.story} />
              </td>
              <td>
                <SourceLink source={source} />
              </td>
              <td>
                <FormatDate date={source.date} />
              </td>
              <td>
                <FormatLocation location={source.location} />
              </td>
              <td>
                <Checkmark value={source.sharing} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {loading && <p>loading...</p>}
    </>
  );
}
