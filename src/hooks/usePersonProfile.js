import {pick} from 'lodash';
import {useState, useEffect} from 'react';

import {useStaticDb} from '../SETTINGS';
import staticPeople from '../../db/people.json';

function usePersonProfile({personId}) {
  const [response, setResponse] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (useStaticDb) {
      setResponse(getStaticResponse(personId));
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    fetch(`http://localhost:9000/api/person-profile/${personId}`)
      .then((res) => res.json())
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        console.log('ERROR', err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [personId]);

  return {person: response, isLoading};
}

function getStaticResponse(personId) {
  const person = staticPeople.find(person => person.id === personId);
  return {
    ...pick(person, [
      'id',
      'name',
    ]),
    parents: [],
    spouses: [],
    children: [],
    links: [],
    citations: [],
  };
}

export default usePersonProfile;
