import React from 'react';
import { Outlet } from 'react-router-dom';

import { TagProvider, useTagContext } from 'tag/TagContext';

export default function TagLayout() {
  return (
    <TagProvider>
      <TagOutlet />
    </TagProvider>
  );
}

////////////////////

function TagOutlet() {
  const { loading, notFound } = useTagContext();

  if (loading) {
    return null;
  }

  if (notFound) {
    return <h2>Tag Not Found</h2>;
  }

  return <Outlet />;
}
