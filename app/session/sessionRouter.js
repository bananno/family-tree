import express from 'express';
import { OAuth2Client } from 'google-auth-library';

const oauthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// This router uses the /session prefix
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ user: req.session.user });
});

router.post('/authorize', async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await oauthClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    req.session.user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };

    res.json({
      success: true,
      user: req.session.user,
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).json({ success: false, error: 'Failed to logout' });
    } else {
      res.json({ success: true });
    }
  });
});

export default router;
