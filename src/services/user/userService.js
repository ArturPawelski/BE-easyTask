const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { confirmEmail } = require('../../utils/emailUtils');
const CustomError = require('../../utils/customError');
const userDataService = require('./userDataService');

class UserService {
  async registerUser(name, email, password) {
    try {
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
    } catch (error) {
      throw new CustomError(error.message, error.statusCode || 500);
    }
  }

  async verifyUser(token, verificationCode) {
    try {
      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await userDataService.findUser({ email: payload.email, verificationCode });

      if (!user) {
        throw new CustomError('Verification failed. Incorrect verification code or user not found.', 400);
      }

      if (user.isVerified) {
        throw new CustomError('User already verified.', 400);
      }

      const updatedUser = await userDataService.updateUser({ _id: user._id }, { isVerified: true });

      if (!updatedUser) {
        throw new CustomError('Failed to update user verification status.', 500);
      }

      return true;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new CustomError('Invalid or expired token', 400);
      }
      throw new CustomError(error.message, error.statusCode || 500);
    }
  }
}

module.exports = new UserService();
