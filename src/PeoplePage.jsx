import React, {useEffect, useState} from 'react';
import PeopleList from './PeopleList';

function PeoplePage() {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    fetch('http://localhost:9000/api/people-index')
      .then((res) => res.json())
      .then((res) => {
        setPeople(res.data);
      })
      .catch((err) => {
        console.log('ERROR', err.message);
      });
  }, []);

  return (
    <div>
      <h2>people</h2>
      <PeopleList people={people}/>
    </div>
  );
}

export default PeoplePage;

