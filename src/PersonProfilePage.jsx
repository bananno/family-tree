import React from 'react';
import {useParams} from 'react-router-dom';

import LinkList from './LinkList';
import PeopleList from './PeopleList';
import TagList from './TagList';
import usePersonProfile from './usePersonProfile';

function PersonProfilePage() {
  const {personId} = useParams();
  const {person, isLoading} = usePersonProfile({personId});

  if (isLoading) {
    return (<div>loading...</div>);
  }

  return (
    <div>
      <h2>PERSON: {person.name}</h2>
      <h3>share level</h3>
      {person.shareLevel}
      <h3>tags</h3>
      <TagList tags={person.tags}/>
      <h3>parents</h3>
      <PeopleList people={person.parents}/>
      <h3>siblings</h3>
      <PeopleList people={person.siblings}/>
      <h3>spouses</h3>
      <PeopleList people={person.spouses}/>
      <h3>children</h3>
      <PeopleList people={person.children}/>
      <h3>links</h3>
      <LinkList links={person.links}/>
    </div>
  );
}

export default PersonProfilePage;

