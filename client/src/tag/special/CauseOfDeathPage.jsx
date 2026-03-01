import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import PersonList from 'person/components/PersonList';
import AdminOnly from 'session/AdminOnly';
import api from 'shared/api';

export default function CauseOfDeathPage() {
  const [data, setData] = useState({ causeOfDeath: [], diedYoung: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { result } = await api('/topics/cause-of-death');
      setData({
        causeOfDeath: result?.causeOfDeath || [],
        diedYoung: result?.diedYoung || [],
      });
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const sections = { accident: [], disease: [], war: [], other: [] };

  data.causeOfDeath.forEach(person => {
    const categories = person.tagValue
      ? person.tagValue.split(',').map(s => s.trim().toLowerCase())
      : [];

    categories.forEach(category => {
      if (sections[category]) {
        sections[category].push(person);
      } else {
        sections.other.push(person);
      }
    });
  });

  return (
    <>
      <h1 className="text-3xl font-bold">Cause of Death</h1>
      <AdminOnly>
        <HeaderLinks />
      </AdminOnly>
      <Section title="Accident" description="">
        <PersonList people={sections.accident} getNote={getNote} />
      </Section>
      <Section title="Disease" description="">
        {/* TODO: link to disease topic page */}
        <PersonList people={sections.disease} getNote={getNote} />
      </Section>
      <Section title="War" description="">
        {/* TODO: link to war topic page */}
        <PersonList people={sections.war} getNote={getNote} />
      </Section>
      <Section title="Other" description="">
        <PersonList people={sections.other} getNote={getOtherNote} />
      </Section>
      <Section
        title="Unknown"
        description="Died young or under odd circumstances, but cause of death not yet found."
      >
        <PersonList people={data.diedYoung} />
      </Section>
    </>
  );
}

////////////////////

function HeaderLinks() {
  return (
    <div className="flex gap-4 mt-2 mb-4">
      <Link to="/tag/5ecb29fc33407f3931fdae2e" className="underline">
        tag: cause of death
      </Link>
      <Link to="/tag/5ecb29fd33407f3931fdae2f" className="underline">
        tag: cause of death note
      </Link>
      <Link to="/tag/5ecb296b668f6a38ff0cc471" className="underline">
        tag: died young
      </Link>
      <a
        href="https://ancestry.annacpeterson.com/topic/5e076dc4d20312e6dd591312"
        className="underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        old site topic page
      </a>
    </div>
  );
}

function Section({ title, description, children }) {
  return (
    <div className="mt-8 pt-4 border-t border-gray-300">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-sm text-gray-500 mb-3">{description}</p>
      {children}
    </div>
  );
}

function getNote(person) {
  return person.note || '';
}

function getOtherNote(person) {
  return [person.tagValue, person.note].filter(Boolean).join(' - ') || '';
}
