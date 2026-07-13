import { Routes, Route } from 'react-router-dom';

import ChecklistIndexPage from 'checklist/pages/ChecklistIndexPage';
import ChecklistPersonVitalsPage from 'checklist/pages/ChecklistPersonVitalsPage';
import EventsPage from 'event/pages/EventsPage';
import FilesPage from 'file/pages/FilesPage';
import FeaturedQuotesPage from 'misc/featured-quote/FeaturedQuotesPage';
import NotationIndexPage from 'notation/pages/NotationIndexPage';
import NotationProfilePage from 'notation/pages/NotationProfilePage';
import InventoryIndexPage from 'object/pages/InventoryIndexPage';
import ObjectEditPage from 'object/pages/ObjectEditPage';
import ObjectViewPage from 'object/pages/ObjectViewPage';
// Person
import PersonLayout from 'person/layout/PersonLayout';
import PeopleIndexPage from 'person/pages/PeopleIndexPage';
import PersonAvatarPage from 'person/pages/PersonAvatarPage';
import PersonChecklistPage from 'person/pages/PersonChecklistPage';
import PersonCitationsPage from 'person/pages/PersonCitationsPage';
import PersonEditPage from 'person/pages/PersonEditPage';
import PersonLinksPage from 'person/pages/PersonLinksPage';
import PersonPhotosPage from 'person/pages/PersonPhotosPage';
import PersonSummaryPage from 'person/pages/PersonSummaryPage';
import PersonTagsPage from 'person/pages/PersonTagsPage';
import PersonTechnicalPage from 'person/pages/PersonTechnicalPage';
import PersonTimelinePage from 'person/pages/PersonTimelinePage';
import PersonToDoPage from 'person/pages/PersonToDoPage';
// Misc
import { ROUTE_PATHS } from 'routePaths';
import useSessionContext from 'session/useSessionContext';
// Story/Source
import SourceIndexPage from 'source/pages/SourceIndexPage';
import SourceProfilePage from 'source/pages/SourceProfilePage';
import StoryLayout from 'story/layout/StoryLayout';
import CemeteriesIndexPage from 'story/pages/CemeteriesIndexPage';
import CemeteryPage from 'story/pages/CemeteryPage';
import NewspapersIndexPage from 'story/pages/NewspapersIndexPage';
import StoriesIndexPage from 'story/pages/StoriesIndexPage';
import StoriesNonEntrySourcesPage from 'story/pages/StoriesNonEntrySourcesPage';
import StoryDetailsPage from 'story/pages/StoryDetailsPage';
import StoryEditPage from 'story/pages/StoryEditPage';
import StoryEntriesPage from 'story/pages/StoryEntriesPage';
import StoryMainPage from 'story/pages/StoryMainPage';
// Tag
import TagIndexPage from 'tag/pages/TagIndexPage';
import TagPage from 'tag/pages/TagPage';
import CauseOfDeathPage from 'tag/special/CauseOfDeathPage';
import TagLayout from 'tag/TagLayout';

import HomePage from './HomePage';
import PageNotFound from './PageNotFound';
import AccountPage from './session/AccountPage';
import ToDoPage from './ToDoPage';
import UsersIndexPage from './user/UsersIndexPage';
import UtilitiesPage from './UtilitiesPage';

export default function AppRoutes() {
  const { admin } = useSessionContext();

  return (
    <Routes>
      <Route path="/">
        <Route index element={<HomePage />} />

        {/* PERSON */}
        <Route path={ROUTE_PATHS.personIndex} element={<PeopleIndexPage />} />
        <Route
          path={ROUTE_PATHS.personDetail(':id')}
          element={<PersonLayout />}
        >
          <Route index element={<PersonSummaryPage />} />
          <Route
            path={ROUTE_PATHS.personDetailTimeline(':id')}
            element={<PersonTimelinePage />}
          />
          <Route
            path={ROUTE_PATHS.personDetailCitations(':id')}
            element={<PersonCitationsPage />}
          />
          <Route
            path={ROUTE_PATHS.personDetailEdit(':id')}
            element={<PersonEditPage />}
          />
          <Route
            path={ROUTE_PATHS.personDetailLinks(':id')}
            element={<PersonLinksPage />}
          />
          <Route
            path={ROUTE_PATHS.personDetailPhotos(':id')}
            element={<PersonPhotosPage />}
          />
          {admin && (
            <>
              <Route
                path={ROUTE_PATHS.personDetailAvatar(':id')}
                element={<PersonAvatarPage />}
              />
              <Route
                path={ROUTE_PATHS.personDetailChecklist(':id')}
                element={<PersonChecklistPage />}
              />
              <Route
                path={ROUTE_PATHS.personDetailTechnical(':id')}
                element={<PersonTechnicalPage />}
              />
              <Route
                path={ROUTE_PATHS.personDetailTags(':id')}
                element={<PersonTagsPage />}
              />
            </>
          )}
          <Route path="*" element={<PersonToDoPage />} />
        </Route>

        <Route path={ROUTE_PATHS.storyIndex} element={<StoriesIndexPage />} />
        <Route
          path={ROUTE_PATHS.storyIndexWithType(':storyType')}
          element={<StoriesIndexPage />}
        />
        <Route
          path={ROUTE_PATHS.cemeteryIndex}
          element={<CemeteriesIndexPage />}
        />
        <Route
          path={ROUTE_PATHS.newspaperIndex}
          element={<NewspapersIndexPage />}
        />
        <Route
          path={ROUTE_PATHS.cemeteryDetail(':id')}
          element={<CemeteryPage />}
        />
        {admin && (
          <Route
            path="stories-non-entry-sources"
            element={<StoriesNonEntrySourcesPage />}
          />
        )}
        <Route path="/story/:id" element={<StoryLayout />}>
          <Route index element={<StoryMainPage />} />
          <Route
            path={ROUTE_PATHS.storyDetailTechnical(':id')}
            element={<StoryDetailsPage />}
          />
          <Route
            path={ROUTE_PATHS.storyDetailEdit(':id')}
            element={<StoryEditPage />}
          />
          <Route path="/story/:id/entries" element={<StoryEntriesPage />} />
        </Route>

        {admin && <Route path="sources" element={<SourceIndexPage />} />}
        {admin && (
          <Route path="sources/:sourceType" element={<SourceIndexPage />} />
        )}
        <Route path="source/:sourceId" element={<SourceProfilePage />} />

        {admin && (
          <>
            <Route path={ROUTE_PATHS.eventIndex} element={<EventsPage />} />
            <Route
              path={ROUTE_PATHS.eventIndexCategory(':category')}
              element={<EventsPage />}
            />

            <Route path="files" element={<FilesPage />} />

            <Route path="featured-quotes" element={<FeaturedQuotesPage />} />

            <Route path="notations" element={<NotationIndexPage />} />
            <Route
              path="notation/:notationId"
              element={<NotationProfilePage />}
            />

            <Route path="tags" element={<TagIndexPage />} />
            <Route path="tags/:showTagsBy" element={<TagIndexPage />} />
            <Route path="/tag/:id" element={<TagLayout />}>
              <Route index element={<TagPage />} />
            </Route>
            <Route
              path={ROUTE_PATHS.specialCauseOfDeath}
              element={<CauseOfDeathPage />}
            />

            <Route path="checklists" element={<ChecklistIndexPage />} />
            <Route
              path="checklist/person-vitals"
              element={<ChecklistPersonVitalsPage />}
            />

            <Route path="map" element={<ToDoPage title="map" />} />
            <Route path="utilities" element={<UtilitiesPage />} />
            <Route path="users" element={<UsersIndexPage />} />

            <Route
              path={ROUTE_PATHS.inventoryIndex}
              element={<InventoryIndexPage />}
            />
            <Route
              path={ROUTE_PATHS.objectDetail(':id')}
              element={<ObjectViewPage />}
            />
            <Route
              path={ROUTE_PATHS.objectDetailEdit(':id')}
              element={<ObjectEditPage />}
            />
          </>
        )}
        <Route path="/account" element={<AccountPage />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}
