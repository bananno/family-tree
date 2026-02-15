import clsx from 'clsx';
import { useEffect, useState } from 'react';

import PersonLink from 'person/components/PersonLink';
import useSessionContext from 'session/useSessionContext';
import api from 'shared/api';
import Button from 'shared/form/Button';

import UserModal from './UserModal.jsx';

export default function UsersIndexPage() {
  const { currentUser } = useSessionContext();
  const [users, setUsers] = useState([]);
  const [unlinkedPeople, setUnlinkedPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  async function fetchUsers() {
    const { result } = await api('/users', { catchPlease: true });
    if (result.users) {
      setUsers(result.users);
    }
    if (result.unlinkedPeople) {
      setUnlinkedPeople(result.unlinkedPeople);
    }
    if (result.error) {
      setError(result.error);
    }
    setLoading(false);
  }

  const headerClass = 'p-4 text-left border border-gray-300';
  const cellClass = 'p-4 border border-gray-300';

  return (
    <>
      <h1 className="text-2xl font-bold">Users Index Page</h1>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <UserModal
        create
        afterSubmit={fetchUsers}
        unlinkedPeople={unlinkedPeople}
      />
      {editUser && (
        <UserModal
          afterSubmit={fetchUsers}
          editUser={editUser}
          onClose={() => setEditUser(null)}
          unlinkedPeople={unlinkedPeople}
        />
      )}
      <table className="mt-4">
        <thead>
          <tr>
            <th className={headerClass}></th>
            <th className={headerClass}>name</th>
            <th className={headerClass}>email</th>
            <th className={headerClass}>first login</th>
            <th className={headerClass}>last login</th>
            <th className={headerClass}>person</th>
            <th className={headerClass}>access</th>
            <th className={headerClass}></th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className={clsx(cellClass, 'w-32 flex-shrink-0')}>
                {user.ssoPicture && (
                  <img
                    src={user.ssoPicture}
                    alt={user.name}
                    className="w-24 h-24 flex-shrink-0"
                  />
                )}
              </td>
              <td className={cellClass}>{user.name}</td>
              <td className={cellClass}>{user.email}</td>
              <td className={cellClass}>
                {user.firstLoginAt
                  ? new Date(user.firstLoginAt).toLocaleString()
                  : '--'}
              </td>
              <td className={cellClass}>
                {user.lastLoginAt
                  ? new Date(user.lastLoginAt).toLocaleString()
                  : '--'}
              </td>
              <td className={cellClass}>
                {user.person && <PersonLink person={user.person} />}
              </td>
              <td className={cellClass}>{user.admin && 'Admin'}</td>
              <td className={cellClass}>
                <Button text="Edit" onClick={() => setEditUser(user)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
