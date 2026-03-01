import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import AdminOnly from 'session/AdminOnly';
import api from 'shared/api';
import Checkmark from 'shared/Checkmark';
import FormatLocation from 'shared/FormatLocation';

export default function CemeteryPage() {
  const { id: storyId } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchStory() {
    const { result, error } = await api(`/stories/${storyId}`);
    setStory(result || null);
    setLoading(false);
  }

  useEffect(() => {
    setStory(null);
    fetchStory();
  }, [storyId]);

  return (
    <>
      <Link to="/cemeteries" className="mb-4 inline-block">
        Back to cemeteries
      </Link>
      {loading && <p>Loading...</p>}
      {story && (
        <>
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{story.title}</h1>
            <p>
              <FormatLocation location={story.location} v2 />
            </p>
            <p>
              {story.entries.length == 1
                ? '1 burial'
                : `${story.entries.length} burials`}
            </p>
            <AdminOnly>
              <p>
                <Link to={`/story/${story.id}`}>generic story view</Link>
                <span className="mx-2">|</span>
                <Link to={`http://localhost:9000/story/${story.id}`}>
                  ejs app
                </Link>
              </p>
              <div className="flex items-center gap-1 text-sm text-stone-500">
                <Checkmark value={story.sharing} />
                <span>{story.sharing ? 'shared' : 'private'}</span>
              </div>
            </AdminOnly>
            <hr />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {story.entries.map(source => (
                <EntryCard key={source.id} source={source} />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

////////////////////

function EntryCard({ source }) {
  return (
    <div className="flex items-center gap-4 mb-4">
      {source.imageUrl && (
        <img
          src={source.imageUrl}
          alt={source.title}
          className="w-24 h-24 object-cover rounded"
        />
      )}
      <div>
        <h3 className="text-xl font-semibold">{source.title}</h3>
      </div>
    </div>
  );
}
