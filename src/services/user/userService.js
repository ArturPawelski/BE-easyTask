const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { confirmEmail } = require('../../utils/emailUtils');
const CustomError = require('../../utils/customError');
const userDataService = require('./userDataService');

class UserService {
  async registerUser(name, email, password) {
    const userAvailable = await userDataService.findUser({
      $or: [{ email }, { name }],
    });
    if (userAvailable) {
      throw new CustomError('User already registered', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.VERIFICATION_EXPIRES });
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    const verificationLink = `${process.env.FRONT_APP_URL}/verify?token=${verificationToken}`;

    const user = await userDataService.createUser({
      name,
      email,
      password: hashedPassword,
      verificationCode,
      verificationToken,
    });
    if (!user) {
      throw new CustomError('User data is not valid', 400);
    }

    confirmEmail(user.email, verificationCode, verificationLink);
    return user;
  }
}

module.exports = new UserService();
