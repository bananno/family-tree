import React from 'react';
import { Link } from 'react-router-dom';

import usePersonChecklist from 'person/hooks/usePersonChecklist';
import { usePersonContext } from 'person/PersonContext';
import Checkmark from 'shared/Checkmark';

// TODO: clean up styling
export default function PersonChecklistPage() {
  const { sections, otherIncompleteSources } = usePersonChecklist();

  return (
    <>
      <h2>Checklist</h2>
      {sections.map(section => (
        <React.Fragment key={section.title}>
          <h3>{section.title}</h3>
          {section.items.map(item => (
            <CheckmarkItem key={item.title} item={item} />
          ))}
        </React.Fragment>
      ))}
      <h3>Incomplete Sources</h3>
      {otherIncompleteSources.map(item => (
        <div key={item.id}>
          <Checkmark value={false} />
          <Link to={`/source/${item.id}`}>{item.title}</Link> - {item.missing}
        </div>
      ))}
    </>
  );
}

////////////////////

function CheckmarkItem({ item }) {
  const { person } = usePersonContext();

  const strike =
    !item.complete && (item.strike || (item.strikeLiving && person.living));

  return (
    <div>
      <Checkmark value={item.complete || strike} />
      {strike ? <s>{item.title}</s> : item.title}{' '}
      {item.note && <i>({item.note})</i>}
    </div>
  );
}
