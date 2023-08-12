import React from 'react';
import {useParams} from 'react-router-dom';

import CitationList from '../CitationList';
import FormatContent from '../FormatContent';
import FormatDate from '../FormatDate';
import FormatLocation from '../FormatLocation';
import LinkList from '../LinkList';
import PersonList from '../person/PersonList';
import StoryLink from '../story/StoryLink';
import TagList from '../tag/TagList';
import useSourceProfile from '../hooks/useSourceProfile';

function SourceProfilePage() {
  const {sourceId} = useParams();
  const {source, isLoading} = useSourceProfile({sourceId});

  if (isLoading) {
    return (<div>loading...</div>);
  }

  return (
    <div>
      <h2>{source.story.type}: <StoryLink story={source.story}/></h2>
      <h2>{source.title}</h2>
      <hr/>
      <h2>sharing</h2>
      <p>{String(source.sharing)}</p>
      <h2>date</h2>
      <p><FormatDate date={source.date}/></p>
      <h2>location</h2>
      <p><FormatLocation location={source.location}/></p>
      <h2>tags</h2>
      <TagList tags={source.tags}/>
      <h2>people</h2>
      <PersonList people={source.people}/>
      <h2>links</h2>
      <LinkList links={source.links}/>
      <h2>notes</h2>
      <ul>
        {source.notes.map((note, i) => (<li key={i}>{note}</li>))}
      </ul>
      <h2>images</h2>
      <p>(to do)</p>
      <h2>content</h2>
      <FormatContent content={source.content}/>
      <h2>citations</h2>
      <CitationList citations={source.citations} showSource={false}/>
    </div>
  );
}

export default SourceProfilePage;
