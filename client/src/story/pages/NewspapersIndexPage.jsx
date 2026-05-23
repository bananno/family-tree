import clsx from 'clsx';
import { Link } from 'react-router-dom';

import AdminOnly from 'session/AdminOnly';
import Checkmark from 'shared/Checkmark';
import Filter from 'shared/Filter';
import FormatLocation from 'shared/FormatLocation';
import Spacer from 'shared/Spacer';
import NewStoryModal from 'story/components/NewStoryModal';
import useStories from 'story/hooks/useStories';

import { ROUTE_PATHS } from '../../routePaths';

const filterId = 'FILTER_NEWSPAPERS_PAGE';

export default function NewspapersIndexPage() {
  const { stories, loading } = useStories({
    storyType: 'newspaper',
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
      <h1 className="text-3xl font-bold">Newspapers</h1>
      <AdminOnly>
        <p>
          <Link to={ROUTE_PATHS.newspaperIndex}>special newspaper view</Link> |{' '}
          <Link to="/stories/newspaper">
            generic story index for newspapers
          </Link>
        </p>
      </AdminOnly>
      <Spacer />
      <Filter filterId={filterId} />
      {loading && stories.length === 0 && <p>loading...</p>}
      <Spacer />
      <NewStoryModal kind="newspaper" allowDate={false} allowLocation />
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
                <NewspaperCard key={story.id} story={story} />
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

function NewspaperCard({ story }) {
  return (
    <div
      className={clsx(
        'bg-stone-50 border border-stone-200 rounded-2xl',
        'shadow-sm hover:shadow-md transition-shadow duration-200 flex gap-4',
      )}
    >
      <div className="flex flex-col space-y-2 p-2">
        <h2 className="text-lg font-semibold text-stone-800 font-serif">
          <Link to={ROUTE_PATHS.newspaperDetail(story)}>{story.title}</Link>
        </h2>
        <p className="text-sm text-stone-500 mb-2">
          <FormatLocation location={story.location} v2 />
        </p>
        <p className="text-stone-700 leading-relaxed line-clamp-3 text-md">
          {story.sourceCount || 0}{' '}
          {story.sourceCount == 1 ? 'article' : 'articles'} in the database
        </p>
        {/* TODO: show earliest + latest years for entries */}
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
