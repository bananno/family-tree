import React from 'react';
import { Link } from 'react-router-dom';

import SourceList from 'source/components/SourceList';
import StoryLink from 'story/components/StoryLink';
import useStoriesNonEntrySources from 'story/hooks/useStoriesNonEntrySources';

export default function StoriesNonEntrySourcesPage() {
  const { stories, isLoading } = useStoriesNonEntrySources();

  return (
    <>
      <Link to="/stories">back to stories</Link>
      <h1>stories with non-entry sources</h1>
      <div style={{ margin: '20px 0' }}>
        List of stories that have non-entry sources attached. Every source
        belongs to a story (as an "entry" source) but it can also be attached to
        other stories, like collections or topics.
      </div>
      {isLoading && <p>loading...</p>}
      {stories.map(story => (
        <div
          key={story.id}
          style={{ margin: '20px 0', borderTop: '1px solid gray' }}
        >
          <div style={{ margin: '20px 0' }}>
            <StoryLink story={story} />
          </div>
          <SourceList sources={story.sources} useFullTitle={true} />
        </div>
      ))}
    </>
  );
}
