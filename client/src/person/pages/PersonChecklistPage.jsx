import React from 'react';
import { Link } from 'react-router-dom';

import usePersonChecklist from 'person/hooks/usePersonChecklist';
import classes from 'person/person.module.scss';
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
            <ItemInSectionList key={item.title} item={item} />
          ))}
        </React.Fragment>
      ))}
      <h3>Incomplete Sources</h3>
      {otherIncompleteSources.map(item => (
        <PersonCheckmarkItem key={item.id} value={false}>
          <Link to={`/source/${item.id}`}>{item.title}</Link> - {item.missing}
        </PersonCheckmarkItem>
      ))}
    </>
  );
}

////////////////////

function ItemInSectionList({ item }) {
  const { person } = usePersonContext();

  const strike =
    !item.complete && (item.strike || (item.strikeLiving && person.living));

  return (
    <PersonCheckmarkItem value={item.complete || strike}>
      {strike ? <s>{item.title}</s> : item.title}{' '}
      {item.note && <i>({item.note})</i>}
    </PersonCheckmarkItem>
  );
}

function PersonCheckmarkItem({ value, children }) {
  return (
    <div className={classes.PersonCheckmarkItem}>
      <Checkmark value={value} />
      <span>{children}</span>
    </div>
  );
}
