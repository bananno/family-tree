import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

import LinkList from './LinkList';
import PeopleList from './PeopleList';
import TagList from './TagList';

function PersonProfilePage(props) {
  const {personId} = useParams();

  const [loading, setLoading] = useState(true);
  const [person, setPerson] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:9000/api/person-profile/${personId}`)
      .then((res) => res.json())
      .then((res) => {
        setPerson(res.data);
      })
      .catch((err) => {
        console.log('ERROR', err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [personId]);

  if (loading) {
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

