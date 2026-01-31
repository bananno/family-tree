import React, { createContext, useEffect, useState } from 'react';

import api from 'shared/api';

export const SESSION_API_PATH = {
  LOGIN: '/session/login',
  LOGOUT: '/session/logout',
  CHECK_SESSION: '/session',
  VALIDATE_SESSION: '/session/authorize',
};

export const SessionContext = createContext();

export function SessionProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionValidationError, setSessionValidationError] = useState(false);

  async function checkExistingSession() {
    setLoading(true);

    const { result, error } = await api(SESSION_API_PATH.CHECK_SESSION, {
      catchPlease: true,
    });

    if (result) {
      setCurrentUser(result.user);
    } else {
      setCurrentUser(null);
    }

    setLoading(false);
  }

  async function validateNewSession(credentialsResponse) {
    const { result, error } = await api(SESSION_API_PATH.VALIDATE_SESSION, {
      body: { credential: credentialsResponse.credential },
      catchPlease: true,
      method: 'POST',
    });

    if (result.success) {
      setCurrentUser(result.user);
      setSessionValidationError(false);
    } else {
      setSessionValidationError(true);
    }
  }

  async function logout() {
    const { result, error } = await api(SESSION_API_PATH.LOGOUT, {
      catchPlease: true,
      method: 'POST',
    });

    if (result.success) {
      setCurrentUser(null);
    }
  }

  useEffect(() => {
    checkExistingSession();
  }, []);

  return (
    <SessionContext.Provider
      value={{
        checkExistingSession,
        currentUser,
        logout,
        loading,
        sessionValidationError,
        validateNewSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
