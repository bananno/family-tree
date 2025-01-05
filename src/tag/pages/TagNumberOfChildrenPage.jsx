import React from 'react';

import PersonList from 'person/components/PersonList';
import TagDetails from 'tag/components/TagDetails';

export default function TagNumberOfChildrenPage({ tag }) {
  const personLists = {
    done0: [],
    doneAll: [],
    tooDistant: [],
    unknown: [],
    specified: [],
  };

  tag.attachedItems?.people?.forEach(person => {
    const section = (() => {
      if (person.tagValue === 'done') {
        if (person.numberOfChildrenInDatabase > 0) {
          return 'doneAll';
        }
        return 'done0';
      }
      if (person.tagValue === 'too distant') {
        return 'tooDistant';
      }
      if (person.tagValue === 'unknown') {
        return 'unknown';
      }
      return 'specified';
    })();
    personLists[section].push(person);
  });

  function getSpecifiedNote(person) {
    return `${person.numberOfChildrenInDatabase} / ${person.tagValue}`;
  }

  return (
    <>
      <TagDetails tag={tag} specialView={true} />
      <hr />
      <h1>people with tag</h1>

      <h2>
        manually specified (number is known, but not all children are in
        database)
      </h2>
      <p>
        showing the number of children in database / the number that is manually
        specified
      </p>
      <PersonList people={personLists.specified} getNote={getSpecifiedNote} />

      <h2>done (all children in database)</h2>
      <p>showing number of children in the database for each person</p>
      <PersonList
        people={personLists.doneAll}
        getNote={person => person.numberOfChildrenInDatabase}
        columns={2}
      />

      <h2>done (does not have, or never had, any children)</h2>
      <PersonList people={personLists.done0} columns={2} />

      <h2>too distant (no need to complete these)</h2>
      <p>showing number of children in the database for each person</p>
      <PersonList
        people={personLists.tooDistant}
        getNote={person => person.numberOfChildrenInDatabase}
        columns={2}
      />

      <h2>unknown (to-do: find the information and mark done)</h2>
      <p>showing number of children in the database for each person</p>
      <PersonList
        people={personLists.unknown}
        getNote={person => person.numberOfChildrenInDatabase}
        columns={2}
      />

      <hr />
      <h2>
        no value specified (to-do: specify either the number or "unknown",
        "done", or "too distant")
      </h2>
      <p>showing number of children in the database for each person</p>
      <PersonList
        people={tag.missingItems?.people}
        getNote={person => person.numberOfChildrenInDatabase}
        columns={2}
      />
    </>
  );
}
