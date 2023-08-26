import {useState, useEffect} from 'react';

import {useStaticDb} from '../SETTINGS';
import staticDb from '../staticDb';

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
  const person = findPerson(personId);

  // TO DO: sort citations by item
  const citations = staticDb.citations
    .filter(citation => citation.personId === personId)
    .map(citation => ({
      ...citation,
      source: staticDb.sources.find(source => source.id === citation.sourceId),
    }));

  const parents = person.parentIds.map(findPerson);

  return {
    ...person,
    parents,
    spouses: person.spouseIds.map(findPerson).filter(Boolean),
    children: person.childIds.map(findPerson).filter(Boolean),
    siblings: getSiblings(),
    links: person.links,
    citations,
    treeParents: getTreeParents(person),
  };

  function findPerson(personId) {
    return staticDb.people.find(person => person.id === personId);
  }

  function getSiblings() {
    // TO DO: sort siblings by birth date
    return [...new Set(parents.flatMap(parent => parent.childIds))]
      .filter(siblingId => siblingId !== person.id)
      .map(findPerson)
      .filter(Boolean); // TO DO: remove references to non-shared people from exported database?
  }

  function getTreeParents(nextPerson) {
    if (!nextPerson) {
      return null;
    }
    return nextPerson.parentIds.map(parentId => {
      const foundParent = findPerson(parentId);
      if (!foundParent) {
        return null;
      }
      return {
        ...foundParent,
        treeParents: getTreeParents(foundParent),
      };
    });
  }
}

export default usePersonProfile;
