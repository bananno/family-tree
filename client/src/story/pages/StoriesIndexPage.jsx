import React from 'react';
import { Link, useParams } from 'react-router-dom';

import BulletList from 'shared/BulletList';
import DevOnly from 'shared/DevOnly';
import Filter from 'shared/Filter';
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
      <BulletList>
        <li>
          <Link to="/stories">all</Link>
        </li>
        {types.map(storyType => (
          <li key={storyType}>
            <Link to={`/stories/${storyType}`}>{storyType}</Link>
          </li>
        ))}
        <DevOnly>
          <li>
            <Link to="/stories-non-entry-sources">
              stories with non-entry sources
            </Link>
          </li>
        </DevOnly>
      </BulletList>
      <Filter filterId={filterId} />
      <StoriesTable stories={stories} />
    </>
  );
}
