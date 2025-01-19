import { sortBy } from 'lodash';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import useEnvironment from 'shared/useEnvironment';
import staticDb from 'staticDb';

const API_URL = 'http://localhost:9000';

export const PersonContext = createContext();

export function PersonProvider({ children }) {
  const { isProduction } = useEnvironment();
  const { id: personId } = useParams();
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  async function fetchPerson() {
    try {
      const res = await fetch(`${API_URL}/people/${personId}`);
      if (res.ok) {
        const json = await res.json();
        setResponse(json);
      } else {
        setResponse({});
        setNotFound(res.status === 404);
      }
    } catch (err) {
      console.log('ERROR', err.message);
    } finally {
      setLoading(false);
    }
  }

  function getStaticPerson() {
    const person = getStaticResponse(personId);
    if (person) {
      setResponse({ person });
    } else {
      setResponse({});
      setNotFound(true);
    }
    setLoading(false);
  }

  useEffect(() => {
    // Set to an empty response to avoid an awkward mix of old and loading data.
    setResponse({});
    setLoading(true);
    setNotFound(false);

    if (isProduction) {
      getStaticPerson();
    } else {
      fetchPerson();
    }
  }, [personId, isProduction]);

  const value = {
    loading,
    notFound,
    person: response.person,
    personId,
  };

  return (
    <PersonContext.Provider value={value}>{children}</PersonContext.Provider>
  );
}

export function usePersonContext() {
  return useContext(PersonContext);
}

////////////////////

// TODO: birth and death
function getStaticResponse(personId) {
  const person = findPerson(personId);

  if (!person) {
    return null;
  }

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
    citations: sortBy(citations, 'sortKey'), // lodash does not sort in place
    treeParents: getTreeParents(person),
  };

  function findPerson(personId) {
    return staticDb.people.find(person => person.id === personId);
  }

  function getSiblings() {
    // TODO: sort siblings by birth date
    return [...new Set(parents.flatMap(parent => parent.childIds))]
      .filter(siblingId => siblingId !== person.id)
      .map(findPerson)
      .filter(Boolean); // TODO: remove references to non-shared people from exported database?
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
