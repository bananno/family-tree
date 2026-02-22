import UserModel from '../user/User.model.js';

let sessionInitialized = false;

export default async function mockLogin(req, res, next) {
  if (
    process.env.NODE_ENV !== 'development' ||
    process.env.MOCK_LOGIN !== 'true'
  ) {
    return next();
  }

  // Only run once to allow "logout" to work properly
  // and do not override a real session if it exists.
  if (sessionInitialized || req.session.user) {
    return next();
  }

  try {
    const user = await UserModel.findOne({ admin: true });
    if (user) {
      req.session.user = user.toSession();
      sessionInitialized = true;
      console.log('Mock login: Admin session created');
    }
  } catch (error) {
    console.error('Mock login error:', error);
  }

  next();
}
