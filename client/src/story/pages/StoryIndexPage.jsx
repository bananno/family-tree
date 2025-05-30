import React from 'react';
import { Link, useParams } from 'react-router-dom';

import BulletList from 'shared/BulletList';
import DevOnly from 'shared/DevOnly';
import Filter from 'shared/Filter';
import StoryList from 'story/components/StoryList';
import useStoryList from 'story/hooks/useStoryList';

const mainStoryTypes = [
  'book',
  'cemetery',
  'document',
  'index',
  'newspaper',
  'website',
  'place',
  'topic',
];

const filterId = 'FILTER_STORY_INDEX_PAGE';

export default function StoryIndexPage() {
  const { storyType } = useParams();
  const { stories, isLoading } = useStoryList({ storyType, filterId });

  return (
    <>
      <h1>Stories</h1>
      {isLoading && <p>loading...</p>}
      <BulletList>
        <li>
          <Link to="/stories">all</Link>
        </li>
        {mainStoryTypes.map(storyType => (
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
      <StoryList stories={stories} />
    </>
  );
}
