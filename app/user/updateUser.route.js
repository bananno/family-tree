import _ from 'lodash';

import UserModel from './User.model.js';

export default async function updateUserRoute(req, res) {
  const user = await UserModel.findById(req.params.id);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  user.name = req.body.name;
  user.person = req.body.person;

  await user.save();

  res.status(200).send();
}
