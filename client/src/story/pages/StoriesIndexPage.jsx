import React from 'react';
import { Link, useParams } from 'react-router-dom';

import BulletList from 'shared/BulletList';
import DevOnly from 'shared/DevOnly';
import Filter from 'shared/Filter';
import Spacer from 'shared/Spacer';
import NewStoryModal from 'story/components/NewStoryModal';
import StoriesTable from 'story/components/StoriesTable';
import useStories from 'story/hooks/useStories';

const filterId = 'FILTER_STORY_INDEX_PAGE';

export default function StoriesIndexPage() {
  const { storyType } = useParams();
  const { stories, types, loading } = useStories({ storyType, filterId });

  return (
    <>
      <h1>Stories</h1>
      {loading && <p>loading...</p>}
      <NewStoryModal types={types} />
      <Spacer />
      <p>Filter by type:</p>
      <BulletList>
        <li>
          <Link to="/stories">all</Link>
        </li>
        {types.map(storyType => (
          <li key={storyType}>
            <Link to={`/stories/${storyType}`}>{storyType}</Link>
          </li>
        ))}
      </BulletList>
      <DevOnly>
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
      </DevOnly>
      <Spacer />
      <Filter filterId={filterId} />
      <StoriesTable stories={stories} />
    </>
  );
}
