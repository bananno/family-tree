import React from 'react';

import Checkmark from 'shared/Checkmark';
import FormatDate from 'shared/FormatDate';
import FormatLocation from 'shared/FormatLocation';
import Table from 'shared/Table';
import StoryLink from 'story/components/StoryLink';

// TODO: add source count as a sortable column.
export default function StoriesTable({ stories }) {
  return (
    <Table>
      <thead>
        <tr>
          <th>type</th>
          <th>title</th>
          <th>date</th>
          <th>location</th>
          <th>notes</th>
          <th>entries</th>
          <th>sharing</th>
        </tr>
      </thead>
      <tbody>
        {stories.map(story => (
          <tr key={story.id}>
            <td>{story.type}</td>
            <td>
              <StoryLink story={story} />
            </td>
            <td>
              <FormatDate date={story.date} />
            </td>
            <td>
              <FormatLocation location={story.location} />
            </td>
            <td>
              {story.notes?.split('\n')?.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </td>
            <td>{story.sourceCount || ''}</td>
            <td>
              <Checkmark value={story.sharing} />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
