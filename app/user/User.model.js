import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    firstLoginAt: { type: Date },
    invitedAt: { type: Date },
    lastLoginAt: { type: Date },
    name: { type: String, required: true },
    ssoId: { type: String },
    ssoPicture: { type: String },
    ssoProvider: { type: String },
    person: { type: mongoose.Schema.Types.ObjectId, ref: 'Person' },
  },
  { timestamps: true },
);

schema.statics.login = async function (payload) {
  const UserModel = this;
  const loginDate = new Date();

  let user = await UserModel.findOne({ email: payload.email });

  if (!user) {
    user = new UserModel({
      email: payload.email,
      name: payload.name,
      ssoId: payload.sub,
      ssoProvider: 'google',
      firstLoginAt: loginDate,
    });
  }

  user.lastLoginAt = loginDate;
  user.ssoPicture = payload.picture;

  await user.save();

  return user;
};

const UserModel = mongoose.model('User', schema);

export default UserModel;
