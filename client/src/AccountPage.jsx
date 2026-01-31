import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useEffect, useState } from 'react';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function AccountPage() {
  const [user, setUser] = useState(null);
  const [userError, setUserError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkForExistingSession();
  }, []);

  async function checkForExistingSession() {
    try {
      const response = await fetch('http://localhost:9000/session', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (data.user) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSuccess(credentialsResponse) {
    try {
      const response = await fetch('http://localhost:9000/session/authorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ credential: credentialsResponse.credential }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
      } else {
        setUserError(true);
      }
    } catch (error) {
      console.error('Error during authorization:', error);
    }
  }

  async function handleLogout() {
    try {
      const response = await fetch('http://localhost:9000/session/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success) {
        setUser(null);
      } else {
        console.log('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {user ? (
        <div>
          <h2>Welcome, {user.name}</h2>
          <img src={user.picture} alt="profile" referrerPolicy="no-referrer" />
          <p>{user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div style={{ textAlign: 'center', width: '300px', margin: '0 auto' }}>
          {userError ? (
            <div style={{ color: 'red' }}>
              <h2>Login failed</h2>
              <p>Please try again.</p>
            </div>
          ) : (
            <h2>Please log in</h2>
          )}

          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.log('Login Failed')}
          />
        </div>
      )}
    </GoogleOAuthProvider>
  );
}
