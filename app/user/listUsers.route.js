import _ from 'lodash';

import UserModel from './User.model.js';

export default async function listUsersRoute(req, res) {
  const users = await UserModel.find().populate('person');

  res.json({
    users: users.map(user => ({
      ..._.pick(user, [
        'id',
        'name',
        'email',
        'ssoPicture',
        'createdAt',
        'lastLoginAt',
      ]),
    })),
  });
}
