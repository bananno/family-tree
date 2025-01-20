import React from 'react';
import { Link, useParams } from 'react-router-dom';

import PersonList from 'person/components/PersonList';
import BulletList from 'shared/BulletList';
import Checkmark from 'shared/Checkmark';
import DevOnly from 'shared/DevOnly';
import FormatContent from 'shared/FormatContent';
import FormatDate from 'shared/FormatDate';
import FormatLocation from 'shared/FormatLocation';
import LinkList from 'shared/LinkList';
import SourceLink from 'source/components/SourceLink';
import SourceList from 'source/components/SourceList';
import useStoryProfile from 'story/hooks/useStoryProfile';
import NewEntrySourceModal from 'source/components/NewEntrySourceModal';
import classes from 'story/story.module.scss';
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
      <Link to={`http://localhost:9000/story/${storyId}`}>old site</Link>
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
      <LinkList links={story.links || []} />
      <h2>notes</h2>
      <BulletList>
        {story.notes?.map((note, i) => (
          <li key={i}>{note}</li>
        ))}
      </BulletList>
      <h2>content</h2>
      <FormatContent content={story.content} />
      <h2>sources (belong to another story, but is related to this story)</h2>
      <SourceList sources={story.nonEntrySources} />
      <h2>entries (belong to this story)</h2>
      <DevOnly>
        <NewEntrySourceModal story={story} />
      </DevOnly>
      {story.type === 'newspaper' ? (
        <NewspaperEntryList sources={story.entries} />
      ) : story.type === 'cemetery' ? (
        <CemeteryEntryList sources={story.entries} />
      ) : (
        <SourceList sources={story.entries} useFullTitle={false} />
      )}
    </div>
  );
}

////////////////////

function CemeteryEntryList({ sources }) {
  return (
    <div className={classes.CemeteryEntryList}>
      {sources?.map(source => (
        <div className={classes.entry} key={source.id}>
          <SourceLink source={source} useFullTitle={false}>
            {source.imageUrl && <img src={source.imageUrl} />}
            {source.title}
          </SourceLink>
        </div>
      ))}
    </div>
  );
}

function NewspaperEntryList({ sources }) {
  return (
    <div className={classes.NewspaperEntryList}>
      {sources?.map(source => (
        <div className={classes.entry} key={source.id}>
          <div className={classes.leftColumn}>
            {formatNewspaperDate(source.date)}
          </div>
          <div className={classes.mainColumn}>
            <SourceLink source={source} useFullTitle={false} />
            {source.summary && <p>{source.summary}</p>}
          </div>
          <div className={classes.rightColumn}>
            {source.imageUrl && (
              <Link to={source.imageUrl} target="_blank">
                <img src={source.imageUrl} />
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function formatNewspaperDate(date) {
  if (date?.display) {
    return <i>date.display</i>;
  }

  const { year, month, day } = date || {};

  if (year && month && day) {
    return new Date(year, month - 1, day).toLocaleDateString('en-UK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  if (year && month) {
    return new Date(year, month - 1, day).toLocaleDateString('en-UK', {
      year: 'numeric',
      month: 'short',
    });
  }

  return year || '';
}
