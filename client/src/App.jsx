import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ChecklistIndexPage from 'checklist/pages/ChecklistIndexPage';
import ChecklistPersonVitalsPage from 'checklist/pages/ChecklistPersonVitalsPage';
import EventsPage from 'event/pages/EventsPage';
import FilesPage from 'file/pages/FilesPage';
import FeaturedQuotesPage from 'misc/featured-quote/FeaturedQuotesPage';
import NotationIndexPage from 'notation/pages/NotationIndexPage';
import NotationProfilePage from 'notation/pages/NotationProfilePage';
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
//
import { EnvironmentProvider, useEnvironment } from 'shared/EnvironmentContext';
import { FilterProvider } from 'shared/FilterContext';
import SourceIndexPage from 'source/pages/SourceIndexPage';
import SourceProfilePage from 'source/pages/SourceProfilePage';
import StoriesIndexPage from 'story/pages/StoriesIndexPage';
import StoriesNonEntrySourcesPage from 'story/pages/StoriesNonEntrySourcesPage';
import StoryProfilePage from 'story/pages/StoryProfilePage';
// Tag
import TagIndexPage from 'tag/pages/TagIndexPage';
import TagPage from 'tag/pages/TagPage';
import TagLayout from 'tag/TagLayout';

import HomePage from './HomePage';
import Layout from './Layout';
import PageNotFound from './PageNotFound';
import ToDoPage from './ToDoPage';
import UtilitiesPage from './UtilitiesPage';

export default function App() {
  return (
    <GlobalProviders>
      <AppRoutes />
    </GlobalProviders>
  );
}

////////////////////

function AppRoutes() {
  const { isDevelopment } = useEnvironment();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />

          {/* PERSON */}
          <Route path="/people" element={<PeopleIndexPage />} />
          <Route path="/person/:id" element={<PersonLayout />}>
            <Route index element={<PersonSummaryPage />} />
            <Route
              path="/person/:id/timeline"
              element={<PersonTimelinePage />}
            />
            <Route
              path="/person/:id/citations"
              element={<PersonCitationsPage />}
            />
            <Route path="/person/:id/edit" element={<PersonEditPage />} />
            <Route path="/person/:id/links" element={<PersonLinksPage />} />
            <Route path="/person/:id/photos" element={<PersonPhotosPage />} />
            {isDevelopment && (
              <>
                <Route
                  path="/person/:id/avatar"
                  element={<PersonAvatarPage />}
                />
                <Route
                  path="/person/:id/checklist"
                  element={<PersonChecklistPage />}
                />
                <Route
                  path="/person/:id/technical"
                  element={<PersonTechnicalPage />}
                />
                <Route path="/person/:id/tags" element={<PersonTagsPage />} />
              </>
            )}
            <Route path="*" element={<PersonToDoPage />} />
          </Route>

          <Route path="stories" element={<StoriesIndexPage />} />
          <Route path="stories/:storyType" element={<StoriesIndexPage />} />
          {isDevelopment && (
            <Route
              path="stories-non-entry-sources"
              element={<StoriesNonEntrySourcesPage />}
            />
          )}
          <Route path="story/:storyId" element={<StoryProfilePage />} />

          {isDevelopment && (
            <Route path="sources" element={<SourceIndexPage />} />
          )}
          {isDevelopment && (
            <Route path="sources/:sourceType" element={<SourceIndexPage />} />
          )}
          <Route path="source/:sourceId" element={<SourceProfilePage />} />

          {isDevelopment && (
            <>
              <Route path="events" element={<EventsPage />} />
              <Route path="events/:category" element={<EventsPage />} />

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

              <Route path="checklists" element={<ChecklistIndexPage />} />
              <Route
                path="checklist/person-vitals"
                element={<ChecklistPersonVitalsPage />}
              />

              <Route path="map" element={<ToDoPage title="map" />} />
              <Route path="utilities" element={<UtilitiesPage />} />
            </>
          )}
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function GlobalProviders({ children }) {
  return (
    <EnvironmentProvider>
      <FilterProvider>{children}</FilterProvider>
    </EnvironmentProvider>
  );
}
