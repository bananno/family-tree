import React from 'react';
import {Link} from 'react-router-dom';

function StoryLink({story}) {
  const storyProfileUrl = `/story/${story.id}`;
  return (
    <Link to={storyProfileUrl}>{story.title}</Link>
  );
}

export default StoryLink;
