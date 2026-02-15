import React from 'react';
import { Link, useParams } from 'react-router-dom';

import useNotation from 'notation/hooks/useNotation';
import PersonList from 'person/components/PersonList';
import useSessionContext from 'session/useSessionContext';
import Checkmark from 'shared/Checkmark';
import StoriesList from 'story/components/StoriesList';
import TagList from 'tag/components/TagList';

export default function NotationProfilePage() {
  const { admin } = useSessionContext();
  const { notationId } = useParams();
  const { notation, notFound, loading } = useNotation({ id: notationId });

  if (!admin) {
    return <p>This page is private.</p>;
  }

  if (loading && !notation) {
    return <p>loading...</p>;
  }

  if (notFound) {
    return <p>Notation not found</p>;
  }

  if (!notation) {
    return <p>Something went wrong.</p>;
  }

  return (
    <div className="flex flex-col items-start space-y-4">
      <h1 className="text-2xl font-bold">
        notation: {notation.title || '(no title)'}
      </h1>

      <p>
        <Link
          to={`http://localhost:9000/notation/${notation.id}/edit`}
          className="text-blue-500"
        >
          edit (EJS page)
        </Link>
      </p>

      <hr className="border-gray-300 w-full" />

      <h2 className="text-xl font-bold">sharing</h2>
      <p className="flex items-center space-x-2">
        <Checkmark value={notation.sharing} />
        {notation.sharing ? 'shared' : 'not shared'}
      </p>

      <h2 className="text-xl font-bold">pinned to stories</h2>
      <StoriesList stories={notation.stories} />
      {notation.stories.length === 0 && <p>(none)</p>}

      <h2 className="text-xl font-bold">people</h2>
      <PersonList people={notation.people} />
      {notation.people.length === 0 && <p>(none)</p>}

      <h2 className="text-xl font-bold">tags</h2>
      <TagList tags={notation.tags} />
      {notation.tags.length === 0 && <p>(none)</p>}

      <h2 className="text-xl font-bold">text</h2>
      <p>{notation.text}</p>
    </div>
  );
}
