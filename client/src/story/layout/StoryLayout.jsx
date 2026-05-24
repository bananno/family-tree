import React from 'react';
import { Link, Outlet } from 'react-router-dom';

import { ROUTE_PATHS } from 'routePaths';
import useStoryContext from 'story/hooks/useStoryContext';
import { StoryProvider } from 'story/layout/StoryContext';

export default function StoryLayout() {
  return (
    <StoryProvider>
      <StoryOutlet />
    </StoryProvider>
  );
}

////////////////////

function StoryOutlet() {
  const { loading, notAuthorized, notFound, story } = useStoryContext();

  if (notFound) {
    return <h1>Story not found</h1>;
  }

  if (notAuthorized) {
    return <h1>This page is private</h1>;
  }

  if (loading && !story) {
    return <h1>Loading...</h1>;
  }

  if (!story) {
    return <h1>Something went wrong</h1>;
  }

  return (
    <>
      <h1 className="text-3xl font-bold">{story.title}</h1>
      <div className="flex gap-4">
        <Link to={ROUTE_PATHS.storyDetail(story.id)}>nice view</Link>
        <span>|</span>
        <Link to={`/story/${story.id}/details`}>technical details</Link>
        <span>|</span>
        <Link to={`/story/${story.id}/entries`}>entry details</Link>
        <span>|</span>
        <Link to={ROUTE_PATHS.storyDetailOld(story.id)}>old site</Link>
        {story.type === 'cemetery' && (
          <>
            <span>|</span>
            <Link to={ROUTE_PATHS.cemeteryDetail(story.id)}>
              alternate view
            </Link>
          </>
        )}
      </div>
      <hr className="my-4" />
      <Outlet />
    </>
  );
}
