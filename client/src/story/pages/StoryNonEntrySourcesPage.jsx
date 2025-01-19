import React from 'react';

import SourceList from 'source/components/SourceList';
import StoryLink from 'story/components/StoryLink';
import useStoryList from 'story/hooks/useStoryList';

export default function StoryNonEntrySourcesPage() {
  const { stories, isLoading } = useStoryList({ storyType: 'nonEntrySources' });

  return (
    <div>
      <h1>stories with non-entry sources</h1>
      {isLoading && <p>loading...</p>}
      {stories.map(story => (
        <div key={story.id}>
          <hr />
          <p>
            <StoryLink story={story} />
          </p>
          <SourceList sources={story.sources} useFullTitle={true} />
        </div>
      ))}
    </div>
  );
}
