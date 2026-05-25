import React from 'react';
import { Link } from 'react-router-dom';

import PersonList from 'person/components/PersonList';
import AdminOnly from 'session/AdminOnly';
import BulletList from 'shared/BulletList';
import Checkmark from 'shared/Checkmark';
import Divider from 'shared/Divider';
import FormatContent from 'shared/FormatContent';
import FormatDate from 'shared/FormatDate';
import FormatLocation from 'shared/FormatLocation';
import LinkList from 'shared/LinkList';
import NewEntrySourceModal from 'source/components/NewEntrySourceModal';
import SourceLink from 'source/components/SourceLink';
import SourceList from 'source/components/SourceList';
import useStoryContext from 'story/hooks/useStoryContext';
import classes from 'story/story.module.scss';
import TagList from 'tag/components/TagList';

export default function StoryDetailsPage() {
  const { story } = useStoryContext();

  const summaryItems = story.summary?.split('\n') || [];

  return (
    <div>
      <h2 className="text-xl font-bold">type</h2>
      <p>{story.type}</p>
      <Divider />
      <AdminOnly>
        <h2 className="text-xl font-bold">sharing</h2>
        <Checkmark value={story.sharing} />
        <Divider />
        <h2 className="text-xl font-bold">tags</h2>
        <TagList tags={story.tags} />
        <Divider />
      </AdminOnly>
      <h2 className="text-xl font-bold">date</h2>
      <p>
        <FormatDate date={story.date} />
      </p>
      <Divider />
      <h2 className="text-xl font-bold">location</h2>
      <p>
        <FormatLocation location={story.location} />
      </p>
      <Divider />
      <h2 className="text-xl font-bold">people</h2>
      <PersonList people={story.people} />
      <Divider />
      <h2 className="text-xl font-bold">links</h2>
      <LinkList links={story.links || []} />
      <Divider />
      <h2 className="text-xl font-bold">notes</h2>
      <BulletList>
        {story.notes?.map((note, i) => (
          <li key={i}>{note}</li>
        ))}
      </BulletList>
      <Divider />
      <h2 className="text-xl font-bold">summary</h2>
      {summaryItems.length === 0 && <p>--</p>}
      {summaryItems.map((paragraph, i) => (
        <p key={i}>{paragraph}</p>
      ))}
      <Divider />
      <h2 className="text-xl font-bold">citation</h2>
      {story.citationText?.map((text, i) => (
        <p key={i}>{text}</p>
      ))}
      <Divider />
      <h2 className="text-xl font-bold">images</h2>
      <p>(todo)</p>
      <Divider />
      <h2 className="text-xl font-bold">content</h2>
      <FormatContent content={story.content} />
      <Divider />
      <h2 className="text-xl font-bold">
        sources (belong to another story, but is related to this story)
      </h2>
      <SourceList sources={story.nonEntrySources} />
      <Divider />
      <h2 className="text-xl font-bold">entries (belong to this story)</h2>
      <AdminOnly>
        <NewEntrySourceModal story={story} />
      </AdminOnly>
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
