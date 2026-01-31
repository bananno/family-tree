import { BrowserRouter } from 'react-router-dom';

import { SessionProvider } from 'session/SessionContext';
import { EnvironmentProvider } from 'shared/EnvironmentContext';
import { FilterProvider } from 'shared/FilterContext';

import AppRoutes from './AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <EnvironmentProvider>
          <FilterProvider>
            <AppRoutes />
          </FilterProvider>
        </EnvironmentProvider>
      </SessionProvider>
    </BrowserRouter>
  );
}
