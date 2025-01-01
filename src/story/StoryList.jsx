import React from 'react';

import BulletList from 'shared/BulletList';
import StoryLink from 'story/StoryLink';

export default function StoryList({ stories }) {
  return (
    <BulletList>
      {stories.map(story => (
        <li key={story.id}>
          <StoryLink story={story} />
        </li>
      ))}
    </BulletList>
  );
}
