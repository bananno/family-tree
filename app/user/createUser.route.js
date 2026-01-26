import _ from 'lodash';

import UserModel from './User.model.js';

export default async function createUserRoute(req, res) {
  const { name, email } = req.body;

  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    res.status(409).json({ error: 'User with this email already exists' });
    return;
  }

  const user = new UserModel({ name, email });
  await user.save();

  res.status(201).json({ user: _.pick(user, ['id', 'name', 'email']) });
}
