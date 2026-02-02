import useSessionContext from 'session/useSessionContext';

export default function AdminOnly({ children }) {
  const { currentUser } = useSessionContext();
  return currentUser?.admin ? children : null;
}
