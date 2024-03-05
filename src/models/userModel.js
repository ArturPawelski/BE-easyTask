const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'please add the name'],
      unique: [true, ' A user with this name already exists'],
    },
    email: {
      type: String,
      required: [true, 'please add the email'],
      unique: [true, 'email address already taken'],
    },
    password: {
      type: String,
      required: [true, 'plase add the password'],
    },
    verificationToken: { type: String },
    verificationCode: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model('Users', userSchema);

module.exports = userModel;
