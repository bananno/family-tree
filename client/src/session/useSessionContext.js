import { useContext } from 'react';

import { SessionContext } from './SessionContext';

export default function useSessionContext() {
  return useContext(SessionContext);
}
