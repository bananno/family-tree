import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { useStaticDb } from './SETTINGS';

import Layout from './Layout';
import HomePage from './HomePage';
import ToDoPage from './ToDoPage';
import PageNotFound from './PageNotFound';

import ChecklistIndexPage from 'checklist/ChecklistIndexPage';
import ChecklistPersonVitalsPage from 'checklist/ChecklistPersonVitalsPage';
import EventsPage from 'event/EventsPage';
import FilesPage from 'file/FilesPage';
import NotationIndexPage from 'notation/NotationIndexPage';
import NotationProfilePage from 'notation/NotationProfilePage';
import PersonIndexPage from 'person/PersonIndexPage';
import PersonProfilePage from 'person/PersonProfilePage';
import SourceIndexPage from 'source/SourceIndexPage';
import SourceProfilePage from 'source/SourceProfilePage';
import StoryIndexPage from 'story/StoryIndexPage';
import StoryNonEntrySourcesPage from 'story/StoryNonEntrySourcesPage';
import StoryProfilePage from 'story/StoryProfilePage';
import TagIndexPage from 'tag/TagIndexPage';
import TagProfilePage from 'tag/TagProfilePage';
import UtilitiesPage from './UtilitiesPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />

          <Route path="people" element={<PersonIndexPage />} />
          <Route path="person/:personId" element={<PersonProfilePage />} />

          <Route path="stories" element={<StoryIndexPage />} />
          <Route path="stories/:storyType" element={<StoryIndexPage />} />
          {!useStaticDb && (
            <Route
              path="stories-non-entry-sources"
              element={<StoryNonEntrySourcesPage />}
            />
          )}
          <Route path="story/:storyId" element={<StoryProfilePage />} />

          {!useStaticDb && (
            <Route path="sources" element={<SourceIndexPage />} />
          )}
          {!useStaticDb && (
            <Route path="sources/:sourceType" element={<SourceIndexPage />} />
          )}
          <Route path="source/:sourceId" element={<SourceProfilePage />} />

          {!useStaticDb && (
            <>
              <Route path="events" element={<EventsPage />} />

              <Route path="files" element={<FilesPage />} />

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
