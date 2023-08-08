import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

import FormatDate from './FormatDate';
import FormatLocation from './FormatLocation';
import LinkList from './LinkList';
import PeopleList from './PeopleList';
import StoryLink from './StoryLink';
import TagList from './TagList';

function SourceProfilePage() {
  const {sourceId} = useParams();

  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:9000/api/source-profile/${sourceId}`)
      .then((res) => res.json())
      .then((res) => {
        setSource(res.data);
      })
      .catch((err) => {
        console.log('ERROR', err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [sourceId]);

  if (loading) {
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
      <PeopleList people={source.people}/>
      <h2>links</h2>
      <LinkList links={source.links}/>
      <h2>images</h2>
      <p>(to do)</p>
      <h2>content</h2>
      <p>(to do)</p>
      <h2>citations</h2>
      <p>(to do)</p>
    </div>
  );
}

export default SourceProfilePage;

