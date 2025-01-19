import React, { createContext, useContext, useEffect, useState } from 'react';

// In deployed app, environment is always production.
// In local app, environment may be toggled between development and production.
const ENV = {
  DEV: 'development',
  PROD: 'production',
};

export const EnvironmentContext = createContext();

export function EnvironmentProvider({ children }) {
  const isLocal = window.location.hostname === 'localhost';
  const [environment, setEnvironment] = useState(null);

  // Set environment on first load.
  // Store the environment if it's not already stored.
  // Ensure that the stored environment is valid.
  useEffect(() => {
    const stored = localStorage.getItem('environment');
    if ([ENV.DEV, ENV.PROD].includes(stored)) {
      setEnvironment(stored);
    } else {
      const determined = isLocal ? ENV.DEV : ENV.PROD;
      localStorage.setItem('environment', determined);
      setEnvironment(determined);
    }
  }, [isLocal]);

  const isProduction = environment === ENV.PROD;
  const isDevelopment = !isProduction;

  function toggleEnvironment() {
    const newEnvironment = environment === ENV.DEV ? ENV.PROD : ENV.DEV;
    localStorage.setItem('environment', newEnvironment);
    setEnvironment(newEnvironment);
  }

  const value = {
    isLocal,
    environment,
    isDevelopment,
    isProduction,
    toggleEnvironment,
  };

  return (
    <EnvironmentContext.Provider value={value}>
      {children}
    </EnvironmentContext.Provider>
  );
}

export function useEnvironment() {
  return useContext(EnvironmentContext);
}
