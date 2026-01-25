import { BrowserRouter } from 'react-router-dom';

import { EnvironmentProvider } from 'shared/EnvironmentContext';
import { FilterProvider } from 'shared/FilterContext';

import AppRoutes from './AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <EnvironmentProvider>
        <FilterProvider>
          <AppRoutes />
        </FilterProvider>
      </EnvironmentProvider>
    </BrowserRouter>
  );
}
