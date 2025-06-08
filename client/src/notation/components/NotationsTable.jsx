import React from 'react';

import NotationLink from 'notation/components/NotationLink';
import Checkmark from 'shared/Checkmark';
import Table from 'shared/Table';
import TagList from 'tag/components/TagList';

export default function NotationsTable({ notations }) {
  return (
    <Table>
      <thead>
        <tr>
          <th>category</th>
          <th>title</th>
          <th>content</th>
          <th>tags</th>
          <th>sharing</th>
        </tr>
      </thead>
      <tbody>
        {notations.map(notation => (
          <tr key={notation.id}>
            <td>
              {notation.category}
            </td>
            <td>
              <NotationLink notation={notation} />
            </td>
            <td style={{ maxWidth: '500px', overflowWrap: 'break-word' }}>
              {notation.content}
            </td>
            <td>
              <TagList tags={notation.tags} />
            </td>
            <td>
              <Checkmark value={notation.sharing} />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
