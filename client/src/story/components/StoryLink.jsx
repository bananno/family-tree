import React from 'react';
import { Link } from 'react-router-dom';

import { ROUTE_PATHS } from 'routePaths';

const storyKindPaths = {
  cemetery: ROUTE_PATHS.cemeteryDetail,
  newspaper: ROUTE_PATHS.newspaperDetail,
};

export default function StoryLink({ story }) {
  const storyProfileUrl =
    storyKindPaths[story.type]?.(story.id) || ROUTE_PATHS.storyDetail(story.id);
  return <Link to={storyProfileUrl}>{story.title}</Link>;
}
