import UserModel from './User.model.js';

export default async function listUsersRoute(req, res) {
  const users = await UserModel.find().populate('person');

  res.json({ users });
}
