import React, { useState } from 'react';
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

export default function StoryIndexPage() {
  const { storyType } = useParams();
  const { stories, isLoading } = useStoryList({ storyType });
  const [filterWords, setFilterWords] = useState([]);

  const filteredStories =
    filterWords.length > 0
      ? stories.filter(
          story => !filterWords.some(word => !word.test(story.title)),
        )
      : stories;

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
      <Filter onChange={setFilterWords} />
      <StoryList stories={filteredStories} />
    </>
  );
}
