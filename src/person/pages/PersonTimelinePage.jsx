import React from 'react';

import PersonList from 'person/components/PersonList';
import usePersonTimeline from 'person/hooks/usePersonTimeline';
import { usePersonContext } from 'person/PersonContext';
import useEnvironment from 'shared/useEnvironment';

export default function PersonTimelinePage() {
  const { person } = usePersonContext();
  const { timelineItems } = usePersonTimeline();
  const { isProduction } = useEnvironment();

  return (
    <>
      <h2>Timeline for {person.name}</h2>
      {isProduction && <p>(to do)</p>}
      <PersonTimeline timelineItems={timelineItems} />
    </>
  );
}

////////////////////

function PersonTimeline({ timelineItems }) {
  return (
    <table border="1">
      <tbody>
        {timelineItems.map((item, i) => (
          <tr key={i}>
            <td>
              {[item.date?.year, item.date?.month, item.date?.day]
                .filter(Boolean)
                .join('-')}
            </td>
            <td>
              {item.timelineType}<br/>
              {item.model}<br/>{item.id}
            </td>
            <td>{item.title}</td>
            <td>
              <PersonList people={item.people} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
