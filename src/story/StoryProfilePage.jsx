import React from 'react';
import { useParams } from 'react-router-dom';

import { useStaticDb } from '../SETTINGS';
import BulletList from 'shared/BulletList';
import Checkmark from 'shared/Checkmark';
import FormatContent from '../FormatContent';
import FormatDate from '../FormatDate';
import FormatLocation from '../FormatLocation';
import LinkList from '../LinkList';
import PersonList from 'person/components/PersonList';
import SourceList from 'source/SourceList';
import TagList from 'tag/TagList';
import useStoryProfile from '../hooks/useStoryProfile';

export default function StoryProfilePage() {
  const { storyId } = useParams();
  const { story, isLoading } = useStoryProfile({ storyId });

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      <h2>STORY:</h2>
      <h2>{story.title}</h2>
      <hr />
      <h2>type</h2>
      <p>{story.type}</p>
      {!useStaticDb && (
        <>
          <h2>sharing</h2>
          <Checkmark value={story.sharing} />
          <h2>tags</h2>
          <TagList tags={story.tags} />
        </>
      )}
      <h2>date</h2>
      <p>
        <FormatDate date={story.date} />
      </p>
      <h2>location</h2>
      <p>
        <FormatLocation location={story.location} />
      </p>
      <h2>people</h2>
      <PersonList people={story.people} />
      <h2>links</h2>
      <LinkList links={story.links} />
      <h2>notes</h2>
      <BulletList>
        {story.notes.map((note, i) => (
          <li key={i}>{note}</li>
        ))}
      </BulletList>
      <h2>content</h2>
      <FormatContent content={story.content} />
      <h2>sources (belong to another story, but is related to this story)</h2>
      <SourceList sources={story.nonEntrySources} />
      <h2>entries (belong to this story)</h2>
      <SourceList sources={story.entries} useFullTitle={false} />
    </div>
  );
}
