import React from 'react';

import StoryLink from './StoryLink';

function StoriesPage({stories}) {
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

export default StoriesPage;
