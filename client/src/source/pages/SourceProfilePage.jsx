import { Link, useParams } from 'react-router-dom';

import CitationList from 'citation/components/CitationList';
import PersonList from 'person/components/PersonList';
import { ROUTE_PATHS } from 'routePaths';
import useSessionContext from 'session/useSessionContext';
import BulletList from 'shared/BulletList';
import Checkmark from 'shared/Checkmark';
import DevOnly from 'shared/DevOnly';
import FormatContent from 'shared/FormatContent';
import FormatDate from 'shared/FormatDate';
import FormatLocation from 'shared/FormatLocation';
import LinkList from 'shared/LinkList';
import EditContentModal from 'source/components/EditContentModal';
import useSourceProfile from 'source/hooks/useSourceProfile';
import StoryLink from 'story/components/StoryLink';
import TagList from 'tag/components/TagList';

export default function SourceProfilePage() {
  const { admin } = useSessionContext();
  const { sourceId } = useParams();
  const { source, loading, refetch } = useSourceProfile({ sourceId });

  if (!admin) {
    return <div>page not available</div>;
  }

  if (loading) {
    return <div>loading...</div>;
  }

  if (!source) {
    return <div>error or source not found</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-bold text-xl">
        {source.story.type}: <StoryLink story={source.story} />
      </h2>
      <hr />
      <h2 className="font-bold text-xl">{source.title}</h2>
      <Link to={ROUTE_PATHS.sourceDetailOld(sourceId)}>old site</Link>
      <hr />
      <h2 className="font-bold text-xl">sharing</h2>
      <p>{String(source.sharing)}</p>
      <hr />
      <h2 className="font-bold text-xl">date</h2>
      <p>
        <FormatDate date={source.date} />
      </p>
      <hr />
      <h2 className="font-bold text-xl">location</h2>
      <p>
        <FormatLocation location={source.location} />
      </p>
      <DevOnly>
        <hr />
        <h2 className="font-bold text-xl">tags</h2>
        <TagList tags={source.tags} />
      </DevOnly>
      <hr />
      <h2 className="font-bold text-xl">people</h2>
      <PersonList people={source.people} />
      <hr />
      <h2 className="font-bold text-xl">links</h2>
      <LinkList links={source.links} />
      <hr />
      <h2 className="font-bold text-xl">notes</h2>
      <BulletList>
        {source.notes.map((note, i) => (
          <li key={i}>{note}</li>
        ))}
      </BulletList>
      <hr />
      <h2 className="font-bold text-xl">images</h2>
      <p>(to do)</p>
      <hr />
      <h2 className="font-bold text-xl">content</h2>
      <EditContentModal source={source} sourceId={sourceId} onSave={refetch} />
      <div className="border border-gray-300 p-4">
        <FormatContent markdown={source.useMarkdown}>
          {source.originalContent}
        </FormatContent>
      </div>
      <p className="flex items-center gap-1 text-sm">
        <Checkmark value={source.useMarkdown} /> markdown
      </p>
      <hr />
      <h2 className="font-bold text-xl">citations</h2>
      <CitationList citations={source.citations} showSource={false} />
    </div>
  );
}
