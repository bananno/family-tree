import React from 'react';
import { Link } from 'react-router-dom';

import PersonList from 'person/components/PersonList';
import Checkmark from 'shared/Checkmark';
import FormatContent from 'shared/FormatContent';
import FormatDate from 'shared/FormatDate';
import FormatLocation from 'shared/FormatLocation';
import useStoryContext from 'story/hooks/useStoryContext';
import TagList from 'tag/components/TagList';

// Admin view, hidden but not protected.
export default function StoryEntriesPage() {
  const { story } = useStoryContext();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Entries</h2>
      {story.entries.map(source => (
        <div
          key={source.id}
          className="border p-4 mb-4 flex flex-col gap-2 rounded"
        >
          <h2 className="text-xl font-bold mb-2">
            <Link to={`/source/${source.id}`}>{source.title}</Link>
          </h2>
          <div className="flex gap-2">
            {source.images.map(image => (
              <img
                key={image.id}
                src={image.url}
                alt=""
                className="max-h-36 max-w-64"
              />
            ))}
          </div>
          <hr className="text-gray-300" />
          <div>
            people:
            <PersonList people={source.people} />
          </div>
          <hr className="text-gray-300" />
          <div>
            location:
            <FormatLocation location={source.location} />
          </div>
          <hr className="text-gray-300" />
          <div>
            date:
            <FormatDate location={source.date} />
          </div>
          <hr className="text-gray-300" />
          <div>
            notes:
            <ul className="mt-2 list-disc list-inside">
              {source.notes?.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
          </div>
          <hr className="text-gray-300" />
          <div>
            tags:
            <TagList tags={source.tags} />
          </div>
          <hr className="text-gray-300" />
          <div>
            content:
            <FormatContent content={source.content} />
          </div>
          <hr className="text-gray-300" />
          <div className="flex items-center gap-2">
            <Checkmark value={story.sharing && source.sharing} />
            <span>
              {!story.sharing
                ? 'story is not shared'
                : source.sharing
                  ? 'shared'
                  : 'not shared'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
