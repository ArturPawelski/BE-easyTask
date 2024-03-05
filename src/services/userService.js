const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { confirmEmail } = require('../utils/emailUtils');

class UserService {
  async registerUser(name, email, password) {
    const userAvailable = await userModel.findOne({
      $or: [{ email }, { name }],
    });
    if (userAvailable) {
      throw new Error('user already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.VERIFICATION_EXPIRES });
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      verificationCode,
      verificationToken,
    });
    if (!user) {
      throw new Error('user data is not valid');
    }

    const verificationLink = `${process.env.FRONT_APP_URL}/verify?token=${verificationToken}`;
    confirmEmail(user.email, verificationCode, verificationLink);

    return user;
  }
}

module.exports = new UserService();
