import React from 'react';
import { Link, useParams } from 'react-router-dom';

import AdminOnly from 'session/AdminOnly';
import BulletList from 'shared/BulletList';
import Filter from 'shared/Filter';
import Spacer from 'shared/Spacer';
import NewStoryModal from 'story/components/NewStoryModal';
import StoriesTable from 'story/components/StoriesTable';
import useStories from 'story/hooks/useStories';

import { ROUTE_PATHS } from '../../routePaths';

const filterId = 'FILTER_STORY_INDEX_PAGE';

export default function StoriesIndexPage() {
  const { storyType } = useParams();
  const { stories, allTypes, createableTypes, loading } = useStories({
    storyType,
    filterId,
  });

  const typesAlreadyUpdatedToKind = allTypes.filter(
    t => !createableTypes.includes(t),
  );

  return (
    <>
      <h1 className="text-3xl font-bold">Stories</h1>
      <AdminOnly>
        <TransitionNavigation storyType={storyType} />
      </AdminOnly>
      {loading && <p>loading...</p>}
      <NewStoryModal types={createableTypes} />
      <Spacer />
      <p>Filter by type:</p>
      <BulletList>
        <li>
          <Link to={ROUTE_PATHS.storyIndex}>all</Link>
        </li>
        {createableTypes.map(storyType => (
          <li key={storyType}>
            <Link to={ROUTE_PATHS.storyIndexWithType(storyType)}>
              {storyType}
            </Link>
          </li>
        ))}
      </BulletList>
      <p>Filter by kind:</p>
      <BulletList>
        {typesAlreadyUpdatedToKind.map(storyType => (
          <li key={storyType}>
            <Link to={ROUTE_PATHS.storyIndexWithType(storyType)}>
              {storyType}
            </Link>
          </li>
        ))}
      </BulletList>
      <AdminOnly>
        <p>Other story views:</p>
        <BulletList>
          <li>
            <Link to="/stories-non-entry-sources">
              stories with non-entry sources
            </Link>
          </li>
          <li>
            <Link to={ROUTE_PATHS.cemeteryIndex}>cemeteries index</Link>
          </li>
          <li>
            <Link to={ROUTE_PATHS.newspaperIndex}>newspapers index</Link>
          </li>
        </BulletList>
      </AdminOnly>
      <Spacer />
      <Filter filterId={filterId} />
      <StoriesTable stories={stories} />
    </>
  );
}

////////////////////

// TODO: Clean up eventually
function TransitionNavigation({ storyType }) {
  if (storyType === 'cemetery') {
    return (
      <p>
        <Link to={ROUTE_PATHS.cemeteryIndex}>special cemetery view</Link> |{' '}
        <Link to={ROUTE_PATHS.storyIndexWithType('cemetery')}>
          generic story index for cemeteries
        </Link>
      </p>
    );
  }
  if (storyType === 'newspaper') {
    return (
      <p>
        <Link to={ROUTE_PATHS.newspaperIndex}>special newspaper view</Link> |{' '}
        <Link to={ROUTE_PATHS.storyIndexWithType('newspaper')}>
          generic story index for newspapers
        </Link>
      </p>
    );
  }
  return null;
}
