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
  const defaultEnvironment = isLocal ? ENV.DEV : ENV.PROD;
  const [environment, setEnvironment] = useState(defaultEnvironment);

  // Set environment on first load.
  // Store the environment if it's not already stored.
  // Ensure that the stored environment is valid.
  useEffect(() => {
    const environment = determineEnvironment();
    setEnvironment(environment);
  }, [isLocal]);

  const isProduction = environment === ENV.PROD;
  const isDevelopment = !isProduction;

  function toggleEnvironment() {
    const newEnvironment = environment === ENV.DEV ? ENV.PROD : ENV.DEV;
    storeEnvironment(newEnvironment);
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

////////////////////

function determineEnvironment() {
  const isLocal = window.location.hostname === 'localhost';

  // In actual production, always return production environment.
  if (!isLocal) {
    return ENV.PROD;
  }

  // In local development, check for a stored environment setting.
  const stored = localStorage.getItem('environment');
  if (stored === ENV.DEV || stored === ENV.PROD) {
    return stored;
  }

  // In local development, if no valid environment is stored,
  // default to development environment and store it.
  storeEnvironment(ENV.DEV);
  return ENV.DEV;
}

function storeEnvironment(environment) {
  localStorage.setItem('environment', environment);
}
