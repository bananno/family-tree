import {sortBy} from 'lodash';
import {useState, useEffect} from 'react';

import staticDb from 'staticDb';

import {useStaticDb} from '../SETTINGS';

function useSourceProfile({sourceId}) {
  const [response, setResponse] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (useStaticDb) {
      setResponse(getStaticResponse(sourceId));
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    fetch(`http://localhost:9000/api/source-profile/${sourceId}`)
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
  }, [sourceId]);

  return {source: response, isLoading};
}

function getStaticResponse(sourceId) {
  const source = staticDb.sources.find(story => story.id === sourceId);
  const citations = staticDb.citations
    .filter(citation => citation.sourceId === sourceId)
    .map(citation => ({
      ...citation,
      person: findPerson(citation.personId),
    }));

  return {
    ...source,
    people: source.personIds.map(findPerson),
    story: staticDb.stories.find(story => story.id === source.storyId),
    citations: sortCitationsByPerson(citations, source.personIds),
  };
}

function findPerson(personId) {
  return staticDb.people.find(person => person.id === personId);
}

function sortCitationsByPerson(citations, personIds) {
  // Sort citations by person, in the same order in which the people appear on the source.
  // There may be citations for people who are not attached to the source; show them last.
  return sortBy(citations, citation => {
    const personIndex = personIds.indexOf(citation.personId);
    if (personIndex === -1) {
      return `${pad3(personIds.length)}-${citation.personId}-${citation.sortKey}`;
    }
    return `${pad3(personIndex)}-${citation.sortKey}`;
  });
}

function pad3(num) {
  return String(num).padStart(3, '0');
}

export default useSourceProfile;
