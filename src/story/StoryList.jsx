import React from 'react';

import StoryLink from './StoryLink';

function StoryList({stories}) {
  return (
    <ul>
      {stories.map(story => (
        <li key={story.id}>
          <StoryLink story={story}/>
        </li>
      ))}
    </ul>
  );
}

export default StoryList;
