import React from 'react';
import { Link } from 'react-router-dom';

import PersonList from 'person/components/PersonList';
import { usePersonContext } from 'person/PersonContext';

import classes from './PersonTimeline.module.scss';

/*
  TODO:
    - filter the types via mini navigation/tabs above timeline
    - handle separate "display" date values
    - show locations and descriptions
    - photos/images
    - "source" header
    - static database version
    - for census, remove the entry title, use story title only; add
      "household:" above the person list.
    - link to sources and events.
*/

export default function PersonTimeline({ timelineItems }) {
  const itemsWithYear = timelineItems.filter(item => item?.date?.year);
  const itemsWithoutYear = timelineItems.filter(item => !item?.date?.year);
  const showNoDate = itemsWithYear.length > 0 && itemsWithoutYear.length > 0;
  return (
    <div className={classes.PersonTimeline}>
      {itemsWithYear.map(item => (
        <TimelineItem item={item} key={item.id} />
      ))}
      {showNoDate && <h2>no date</h2>}
      {itemsWithoutYear.map(item => (
        <TimelineItem item={item} key={item.id} />
      ))}
    </div>
  );
}

////////////////////

function TimelineItem({ item }) {
  const { person } = usePersonContext();
  return (
    <div
      className={[classes.timelineItem, getTimelineTypeClass(item)].join(' ')}
    >
      <div className={classes.leftColumn}>
        <h3 className={classes.title}>{item.date?.year}</h3>
        <span className={classes.date}>{getDisplayMonthDay(item)}</span>
      </div>
      <div className={classes.mainColumn}>
        <h3 className={classes.title}>
          <Link to={`/${item.model}/${item.id}`}>{getTitle(item)}</Link>
        </h3>
        <PersonList people={item.people} showCurrent={person.id} smallText />
      </div>
      <div className={classes.rightColumn}>
        {item.imageUrl && (
          <Link to={item.imageUrl} target="_blank">
            <img src={item.imageUrl} />
          </Link>
        )}
      </div>
    </div>
  );
}

function getTimelineTypeClass(item) {
  if (item.timelineType === 'personal') {
    return classes.timelineTypePersonal;
  }
  return classes.timelineTypeOther;
}

function getTitle(item) {
  if (item.timelineType === 'spouse' && item.title === 'birth') {
    return 'birth of future spouse';
  }

  // "birth of child", "death of parent"
  if (['parent', 'spouse', 'child'].includes(item.timelineType)) {
    return `${item.title} of ${item.timelineType}`;
  }

  return item.title;
}

function getDisplayMonthDay(item) {
  const monthNumber = item.date?.month;
  const dayNumber = item.date?.day;

  if (!monthNumber) {
    return '';
  }

  const monthName = new Date(0, monthNumber - 1).toLocaleString('en', {
    month: 'long',
  });

  return dayNumber ? `${monthName} ${dayNumber}` : monthName;
}
