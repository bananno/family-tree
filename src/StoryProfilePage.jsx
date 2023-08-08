import React from 'react';
import {useParams} from 'react-router-dom';

import FormatDate from './FormatDate';
import FormatLocation from './FormatLocation';
import LinkList from './LinkList';
import PersonList from './person/PersonList';
import TagList from './TagList';
import useStoryProfile from './hooks/useStoryProfile';

function StoryProfilePage() {
  const {storyId} = useParams();
  const {story, isLoading} = useStoryProfile({storyId});

  if (isLoading) {
    return (<div>loading...</div>);
  }

  return (
    <div>
      <h2>STORY:</h2>
      <h2>{story.title}</h2>
      <hr/>
      <h2>sharing</h2>
      <p>{String(story.sharing)}</p>
      <h2>type</h2>
      <p>{story.type}</p>
      <h2>tags</h2>
      <TagList tags={story.tags}/>
      <h2>date</h2>
      <p><FormatDate date={story.date}/></p>
      <h2>location</h2>
      <p><FormatLocation location={story.location}/></p>
      <h2>people</h2>
      <PersonList people={story.people}/>
      <h2>links</h2>
      <LinkList links={story.links}/>
      <h2>sources</h2>
      <p>(to do)</p>
    </div>
  );
}

export default StoryProfilePage;
