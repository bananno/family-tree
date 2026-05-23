import React from 'react';
import { Link, useParams } from 'react-router-dom';

import AdminOnly from 'session/AdminOnly';
import BulletList from 'shared/BulletList';
import Filter from 'shared/Filter';
import Spacer from 'shared/Spacer';
import NewStoryModal from 'story/components/NewStoryModal';
import StoriesTable from 'story/components/StoriesTable';
import useStories from 'story/hooks/useStories';

const filterId = 'FILTER_STORY_INDEX_PAGE';

export default function StoriesIndexPage() {
  const { storyType } = useParams();
  const { stories, allTypes, createableTypes, loading } = useStories({
    storyType,
    filterId,
  });

  return (
    <>
      <h1 className="text-3xl font-bold">Stories</h1>
      {storyType === 'cemetery' && (
        <AdminOnly>
          <p>
            <Link to="/cemeteries">special cemetery view</Link> |{' '}
            <Link to="/stories/cemetery">
              generic story index for cemeteries
            </Link>
          </p>
        </AdminOnly>
      )}
      {loading && <p>loading...</p>}
      <NewStoryModal types={createableTypes} />
      <Spacer />
      <p>Filter by type:</p>
      <BulletList>
        <li>
          <Link to="/stories">all</Link>
        </li>
        {allTypes.map(storyType => (
          <li key={storyType}>
            <Link to={`/stories/${storyType}`}>{storyType}</Link>
          </li>
        ))}
      </BulletList>
      <AdminOnly>
        <p>Other story views:</p>
        <BulletList>
          <li>
            <Link to="/stories-non-entry-sources">
              stories with non-entry sources
            </Link>
          </li>
          <li>
            <Link to="/cemeteries">cemeteries: alternate index</Link>
          </li>
        </BulletList>
      </AdminOnly>
      <Spacer />
      <Filter filterId={filterId} />
      <StoriesTable stories={stories} />
    </>
  );
}
