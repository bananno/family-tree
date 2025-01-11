import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import ChecklistIndexPage from 'checklist/pages/ChecklistIndexPage';
import ChecklistPersonVitalsPage from 'checklist/pages/ChecklistPersonVitalsPage';
import EventsPage from 'event/pages/EventsPage';
import FilesPage from 'file/pages/FilesPage';
import FeaturedQuotesPage from 'misc/featured-quote/FeaturedQuotesPage';
import NotationIndexPage from 'notation/pages/NotationIndexPage';
import NotationProfilePage from 'notation/pages/NotationProfilePage';
import PersonLayout from 'person/layout/PersonLayout';
import PersonCitationsPage from 'person/pages/PersonCitationsPage';
import PersonIndexPage from 'person/pages/PersonIndexPage';
import PersonSummaryPage from 'person/pages/PersonSummaryPage';
import PersonTimelinePage from 'person/pages/PersonTimelinePage';
import PersonToDoPage from 'person/pages/PersonToDoPage';
import { EnvironmentProvider, useEnvironment } from 'shared/EnvironmentContext';
import SourceIndexPage from 'source/pages/SourceIndexPage';
import SourceProfilePage from 'source/pages/SourceProfilePage';
import StoryIndexPage from 'story/pages/StoryIndexPage';
import StoryNonEntrySourcesPage from 'story/pages/StoryNonEntrySourcesPage';
import StoryProfilePage from 'story/pages/StoryProfilePage';
import TagIndexPage from 'tag/pages/TagIndexPage';
import TagProfilePage from 'tag/pages/TagProfilePage';

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
          <Route path="/people" element={<PersonIndexPage />} />
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
            {isDevelopment && (
              <Route
                path="/person/:id/checklist"
                element={<PersonSummaryPage />}
              />
            )}
            <Route path="*" element={<PersonToDoPage />} />
          </Route>

          <Route path="stories" element={<StoryIndexPage />} />
          <Route path="stories/:storyType" element={<StoryIndexPage />} />
          {isDevelopment && (
            <Route
              path="stories-non-entry-sources"
              element={<StoryNonEntrySourcesPage />}
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

              <Route path="files" element={<FilesPage />} />

              <Route path="featured-quotes" element={<FeaturedQuotesPage />} />

              <Route path="notations" element={<NotationIndexPage />} />
              <Route
                path="notation/:notationId"
                element={<NotationProfilePage />}
              />

              <Route path="tags" element={<TagIndexPage />} />
              <Route path="tags/:showTagsBy" element={<TagIndexPage />} />
              <Route path="tag/:tagId" element={<TagProfilePage />} />

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
  return <EnvironmentProvider>{children}</EnvironmentProvider>;
}
