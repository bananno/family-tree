import _ from 'lodash';

import UserModel from './User.model.js';
import PersonModel from '../person/Person.model.js';

export default async function listUsersRoute(req, res) {
  const populateAvatar = {
    path: 'avatar',
    select: 'file',
    populate: { path: 'file', select: 'key' },
  };

  const users = await UserModel.find().populate({
    path: 'person',
    populate: populateAvatar,
  });

  // all the people that are living but not yet linked to a user
  const unlinkedLivingPeople = await PersonModel.find({
    living: true,
    _id: { $nin: users.map(user => user.person).filter(Boolean) },
  })
    .sort({ name: 1 })
    .select('name avatar gender');

  res.json({
    users: users.map(user => ({
      ..._.pick(user, [
        'id',
        'admin',
        'email',
        'firstLoginAt',
        'lastLoginAt',
        'name',
        'ssoPicture',
      ]),
      person: user.person?.toListApi(),
    })),
    unlinkedPeople: unlinkedLivingPeople.map(person => ({
      ..._.pick(person, ['id', 'name']),
    })),
  });
}
