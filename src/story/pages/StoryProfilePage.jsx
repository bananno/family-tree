import React from 'react';
import { useParams } from 'react-router-dom';

import PersonList from 'person/components/PersonList';
import BulletList from 'shared/BulletList';
import Checkmark from 'shared/Checkmark';
import DevOnly from 'shared/DevOnly';
import FormatContent from 'shared/FormatContent';
import FormatDate from 'shared/FormatDate';
import FormatLocation from 'shared/FormatLocation';
import LinkList from 'shared/LinkList';
import SourceList from 'source/components/SourceList';
import useStoryProfile from 'story/hooks/useStoryProfile';
import TagList from 'tag/components/TagList';

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
      <DevOnly>
        <h2>sharing</h2>
        <Checkmark value={story.sharing} />
        <h2>tags</h2>
        <TagList tags={story.tags} />
      </DevOnly>
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
