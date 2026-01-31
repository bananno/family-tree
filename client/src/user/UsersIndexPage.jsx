import { useEffect, useState } from 'react';

import PersonLink from 'person/components/PersonLink';
import api from 'shared/api';
import Button from 'shared/form/Button';

import UserModal from './UserModal.jsx';

export default function UsersIndexPage() {
  const [users, setUsers] = useState([]);
  const [unlinkedPeople, setUnlinkedPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

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

  return (
    <>
      <h1>Users Index Page</h1>
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
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th></th>
            <th>name</th>
            <th>email</th>
            <th>first login</th>
            <th>last login</th>
            <th>person</th>
            <th>access</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>
                {user.ssoPicture && (
                  <img src={user.ssoPicture} alt={user.name} width="50" />
                )}
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {user.firstLoginAt
                  ? new Date(user.firstLoginAt).toLocaleString()
                  : '--'}
              </td>
              <td>
                {user.lastLoginAt
                  ? new Date(user.lastLoginAt).toLocaleString()
                  : '--'}
              </td>
              <td>{user.person && <PersonLink person={user.person} />}</td>
              <td>{user.admin && 'Admin'}</td>
              <td>
                <Button text="Edit" onClick={() => setEditUser(user)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
