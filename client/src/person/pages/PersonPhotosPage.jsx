import React from 'react';

import PersonList from 'person/components/PersonList';
import usePersonPhotos from 'person/hooks/usePersonPhotos';

export default function PersonPhotosPage() {
  const { photos } = usePersonPhotos();

  return (
    <>
      <h2>Photos</h2>
      {photos.map(photo => (
        <div key={photo.id}>
          <img
            src={photo.url}
            alt={photo.title}
            style={{ maxWidth: '600px' }}
          />
          <p>{photo.title}</p>
          <PersonList people={photo.people} />
        </div>
      ))}
    </>
  );
}
