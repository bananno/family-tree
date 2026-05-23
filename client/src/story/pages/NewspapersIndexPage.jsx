import clsx from 'clsx';
import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { ROUTE_PATHS } from 'routePaths';
import AdminOnly from 'session/AdminOnly';
import Checkmark from 'shared/Checkmark';
import Filter from 'shared/Filter';
import FormatLocation from 'shared/FormatLocation';
import Spacer from 'shared/Spacer';
import NewStoryModal from 'story/components/NewStoryModal';
import StoriesTable from 'story/components/StoriesTable';
import useStories from 'story/hooks/useStories';

const filterId = 'FILTER_NEWSPAPERS_PAGE';

export default function NewspapersIndexPage() {
  const [searchParams] = useSearchParams();
  const viewAsTable = searchParams.get('view') === 'table';

  const { stories, loading } = useStories({
    storyType: 'newspaper',
    filterId,
  });

  const totalEntries = useMemo(() => {
    return stories.reduce((sum, story) => sum + (story.sourceCount || 0), 0);
  }, [stories]);

  return (
    <>
      <h1 className="text-3xl font-bold">Newspapers</h1>
      <AdminOnly>
        <p>
          <Link to={ROUTE_PATHS.newspaperIndex}>newspaper view</Link> |{' '}
          <Link to={`${ROUTE_PATHS.newspaperIndex}?view=table`}>
            stories table
          </Link>
        </p>
      </AdminOnly>
      <Spacer />
      <Filter filterId={filterId} />
      {loading && stories.length === 0 && <p>loading...</p>}
      <Spacer />
      <NewStoryModal kind="newspaper" allowDate={false} allowLocation />
      <Spacer />
      <p>
        {stories.length} {stories.length === 1 ? 'newspaper' : 'newspapers'}{' '}
        with {totalEntries} {totalEntries === 1 ? 'article' : 'articles'} in the
        database
      </p>
      <Spacer />
      {viewAsTable ? (
        <StoriesTable stories={stories} />
      ) : (
        <NewspapersAsCards stories={stories} />
      )}
    </>
  );
}

////////////////////

function NewspapersAsCards({ stories }) {
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
                <NewspaperCard key={story.id} story={story} />
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

function getGroupKey(story) {
  if (story.location?.country !== 'United States') {
    return story.location?.country || 'Unknown';
  }

  const state = story.location?.region1;

  return state ? `US-${state}` : 'Unknown';
}

function NewspaperCard({ story }) {
  return (
    <Link
      to={ROUTE_PATHS.newspaperDetail(story.id)}
      className={clsx(
        'block border border-stone-300 rounded-sm',
        'shadow-sm hover:shadow-md transition-shadow duration-200',
        'bg-gradient-to-b from-amber-50 to-stone-50',
        'relative overflow-hidden',
      )}
    >
      <div className="border-b border-stone-300 bg-stone-800 px-4 py-2">
        <h2 className="text-lg font-bold text-amber-50 font-serif tracking-wide text-center uppercase">
          {story.title}
        </h2>
      </div>
      <div className="px-4 py-3 space-y-2">
        <p className="text-lg text-stone-600 text-center italic">
          <FormatLocation location={story.location} v2 />
        </p>
        <div className="border-t border-dashed border-stone-300 pt-2 flex items-center justify-between">
          <span className="text-stone-700 text-lg">
            {story.sourceCount || 0}{' '}
            {story.sourceCount == 1 ? 'article' : 'articles'} in the database
          </span>
          <span className="text-stone-500 text-lg">
            {/* TODO: show a range of earlist to latest article years */}
          </span>
        </div>
        <div className="text-right">
          <span className="text-lg text-stone-500 underline">
            View articles &rarr;
          </span>
        </div>
        <AdminOnly>
          <div className="flex items-center gap-1 text-xs text-stone-500">
            <Checkmark value={story.sharing} />
            <span>{story.sharing ? 'shared' : 'private'}</span>
          </div>
        </AdminOnly>
      </div>
    </Link>
  );
}
