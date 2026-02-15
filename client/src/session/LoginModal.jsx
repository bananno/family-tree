import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

import useSessionContext from 'session/useSessionContext';
import Modal from 'shared/Modal';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function LoginModal() {
  const { currentUser, logout, sessionValidationError, validateNewSession } =
    useSessionContext();

  return (
    <Modal
      triggerButtonLabel="login"
      cancelButtonLabel={currentUser ? 'Close' : 'Cancel'}
    >
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {currentUser ? (
          <div>
            <h2>Welcome, {currentUser.name}</h2>
            <img
              src={currentUser.picture}
              alt="profile"
              referrerPolicy="no-referrer"
            />
            <p>{currentUser.email}</p>
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <div
            style={{ textAlign: 'center', width: '300px', margin: '0 auto' }}
          >
            {sessionValidationError ? (
              <div style={{ color: 'red' }}>
                <h2>Login failed</h2>
                <p>Please try again.</p>
              </div>
            ) : (
              <h2>Please log in</h2>
            )}

            <GoogleLogin
              onSuccess={validateNewSession}
              onError={() => console.log('Login Failed')}
            />
          </div>
        )}
      </GoogleOAuthProvider>
    </Modal>
  );
}
