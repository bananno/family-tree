import React from 'react';
import { Link } from 'react-router-dom';

import AdminOnly from 'session/AdminOnly';
import Checkmark from 'shared/Checkmark';
import Filter from 'shared/Filter';
import FormatLocation from 'shared/FormatLocation';
import Spacer from 'shared/Spacer';
import useStories from 'story/hooks/useStories';

const filterId = 'FILTER_CEMETERIES_PAGE';

export default function CemeteriesIndexPage() {
  const { stories, loading } = useStories({
    storyType: 'cemetery',
    filterId,
  });

  const stateGroups = {};

  stories.forEach(story => {
    const groupKey = getGroupKey(story);

    if (stateGroups[groupKey]) {
      stateGroups[groupKey].push(story);
    } else {
      stateGroups[groupKey] = [story];
    }
  });

  const groupKeys = Object.keys(stateGroups).sort();

  return (
    <>
      <h1 className="text-3xl font-bold">Cemeteries</h1>
      <AdminOnly>
        <p>
          <Link to="/cemeteries">special cemetery view</Link> |{' '}
          <Link to="/stories/cemetery">generic story index for cemeteries</Link>
        </p>
      </AdminOnly>
      <Spacer />
      <Filter filterId={filterId} />
      {loading && stories.length === 0 && <p>loading...</p>}
      <Spacer />
      {groupKeys.map(groupKey => {
        const groupItems = stateGroups[groupKey];
        return (
          <div key={groupKey} className="mb-12">
            <h2 className="text-2xl font-serif mb-4 text-stone-800">
              {groupKey.startsWith('US-') ? (
                <FormatLocation location={groupItems[0].location} stateOnly />
              ) : (
                <>{groupKey}</>
              )}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stateGroups[groupKey].map(story => (
                <CemeteryCard key={story.id} story={story} />
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

////////////////////

function getGroupKey(story) {
  if (story.location?.country !== 'United States') {
    return story.location?.country || 'Unknown';
  }

  const state = story.location?.region1;

  return state ? `US-${state}` : 'Unknown';
}

function CemeteryCard({ story }) {
  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 flex gap-4">
      {story.coverImage ? (
        <img
          src={story.coverImage}
          alt={story.title}
          className="w-36 rounded-tl-2xl rounded-bl-2xl object-cover flex-shrink-0 self-stretch"
        />
      ) : (
        <div className="w-36 rounded-tl-2xl rounded-bl-2xl  bg-stone-200" />
      )}
      <div className="flex flex-col space-y-2 p-2">
        <h2 className="text-lg font-semibold text-stone-800 font-serif">
          <Link to={`/stories/cemetery/${story.id}`}>{story.title}</Link>
        </h2>
        <p className="text-sm text-stone-500 mb-2">
          <FormatLocation location={story.location} v2 />
        </p>
        <p className="text-stone-700 leading-relaxed line-clamp-3 text-md">
          {story.sourceCount || 0}{' '}
          {story.sourceCount == 1 ? 'burial' : 'burials'} in the database
        </p>
        <AdminOnly>
          <div className="flex items-center gap-1 text-sm text-stone-500">
            <Checkmark value={story.sharing} />
            <span>{story.sharing ? 'shared' : 'private'}</span>
          </div>
        </AdminOnly>
      </div>
    </div>
  );
}
