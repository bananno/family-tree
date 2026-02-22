import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    admin: { type: Boolean, default: false },
    email: { type: String, required: true, unique: true },
    firstLoginAt: { type: Date },
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
    // Don't auto-create users as they must be invited.
    return false;
  }

  user.lastLoginAt = loginDate;

  if (!user.firstLoginAt) {
    user.ssoId = payload.sub;
    user.ssoProvider = 'google';
    user.firstLoginAt = loginDate;
  }

  // Update user preferences
  user.ssoPicture = payload.picture;
  user.name = payload.name;

  await user.save();

  return user;
};

schema.methods.toSession = function () {
  return {
    id: this.id,
    admin: this.admin,
    email: this.email,
    name: this.name,
    picture: this.ssoPicture,
  };
};

const UserModel = mongoose.model('User', schema);

export default UserModel;
