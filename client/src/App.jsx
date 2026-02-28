import { ErrorBoundary } from 'react-error-boundary';
import { BrowserRouter } from 'react-router-dom';

import { SessionProvider } from 'session/SessionContext';
import { EnvironmentProvider } from 'shared/EnvironmentContext';
import { FilterProvider } from 'shared/FilterContext';
import { PeopleProvider } from 'shared/PeopleContext';

import AppRoutes from './AppRoutes';
import Layout from './Layout';

export default function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <EnvironmentProvider>
          <FilterProvider>
            <PeopleProvider>
              <Layout>
                <ErrorBoundary fallback={<>Something went wrong</>}>
                  <AppRoutes />
                </ErrorBoundary>
              </Layout>
            </PeopleProvider>
          </FilterProvider>
        </EnvironmentProvider>
      </SessionProvider>
    </BrowserRouter>
  );
}
