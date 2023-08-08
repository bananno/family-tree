import React from 'react';

import StoryLink from './StoryLink';
import useStoryList from './useStoryList';

function StoriesPage() {
  const {stories, isLoading} = useStoryList();

  return (
    <div>
      <h2>stories</h2>
      {isLoading && <p>loading...</p>}
      <ul>
        {stories.map(story => (
          <li key={story.id}>
            <StoryLink story={story}/>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StoriesPage;

