import React from 'react';

import SourceList from '../source/SourceList';
import StoryLink from './StoryLink';
import useStoryList from '../hooks/useStoryList';

function StoryNonEntrySourcesPage() {
  const {stories, isLoading} = useStoryList({storyType: 'nonEntrySources'});

  return (
    <div>
      <h1>stories with non-entry sources</h1>
      {isLoading && <p>loading...</p>}
      {
        stories.map(story => (
          <div key={story.id}>
            <hr/>
            <p>
              <StoryLink story={story}/>
            </p>
            <SourceList sources={story.sources} useFullTitle={true}/>
          </div>
        ))
      }
    </div>
  );
}

export default StoryNonEntrySourcesPage;
