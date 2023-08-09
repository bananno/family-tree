import React from 'react';

import StoryList from './StoryList';
import useStoryList from '../hooks/useStoryList';

function StoryIndexPage() {
  const {stories, isLoading} = useStoryList();

  return (
    <div>
      <h2>stories</h2>
      {isLoading && <p>loading...</p>}
      <StoryList stories={stories}/>
    </div>
  );
}

export default StoryIndexPage;
