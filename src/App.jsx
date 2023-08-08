import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './Layout';
import HomePage from './HomePage';
import ToDoPage from './ToDoPage';
import PageNotFound from './PageNotFound';

import EventsPage from './EventsPage';
import NotationsPage from './NotationsPage';
import PeoplePage from './PeoplePage';
import PersonProfilePage from './PersonProfilePage';
import SourcesPage from './SourcesPage';
import StoriesPage from './StoriesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="notations" element={<NotationsPage />} />
          <Route path="people" element={<PeoplePage />} />
          <Route path="person/:personId" element={<PersonProfilePage />} />
          <Route path="sources" element={<SourcesPage />} />
          <Route path="stories" element={<StoriesPage />} />

          <Route path="map" element={<ToDoPage title="map"/>} />
          <Route path="checklist" element={<ToDoPage title="checklist"/>} />
          <Route path="tags" element={<ToDoPage title="tags"/>} />

          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
