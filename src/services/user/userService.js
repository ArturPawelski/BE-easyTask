const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { confirmEmail, sendPasswordResetCode } = require('../../utils/emailUtils');
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

  async verifyAccount(verificationToken, verificationCode) {
    try {
      const payload = jwt.verify(verificationToken, process.env.ACCESS_TOKEN_SECRET);
      const user = await userDataService.findUser({ email: payload.email, verificationCode, verificationToken });

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

  async resendVerificationCode(email) {
    try {
      const user = await userDataService.findUser({ email });

      if (!user) {
        throw new CustomError('User not found.', 404);
      }
      if (user.isVerified) {
        throw new CustomError('This account has already been verified.', 400);
      }

      const verificationCode = Math.floor(100000 + Math.random() * 900000);
      const verificationToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.VERIFICATION_EXPIRES });
      const verificationLink = `${process.env.FRONT_APP_URL}/verify?token=${verificationToken}`;

      await userDataService.updateUser({ _id: user._id }, { verificationCode, verificationToken });

      confirmEmail(email, verificationCode, verificationLink);

      return true;
    } catch (error) {
      throw new CustomError(error.message, error.statusCode || 500);
    }
  }

  async resetPassword(email) {
    try {
      const user = await userDataService.findUser({ email });

      if (!user) {
        return true;
      }
      if (user.isVerified === false) {
        throw new CustomError('This account has not been verified.', 400);
      }

      const verificationCode = Math.floor(100000 + Math.random() * 900000);
      const resetToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.VERIFICATION_EXPIRES });
      const resetLink = `${process.env.FRONT_APP_URL}/reset-password?token=${resetToken}`;

      await userDataService.updateUser(user._id, {
        resetPasswordToken: resetToken,
        resetPasswordVerificationCode: verificationCode,
      });

      await sendPasswordResetCode(user.email, verificationCode, resetLink);

      return true;
    } catch (error) {
      throw new CustomError(error.message, error.statusCode || 500);
    }
  }

  async updatePassword(resetPasswordVerificationCode, newPassword, resetPasswordToken) {
    try {
      const payload = jwt.verify(resetPasswordToken, process.env.ACCESS_TOKEN_SECRET);

      const user = await userDataService.findUser({ email: payload.email, resetPasswordVerificationCode, resetPasswordToken });

      if (!user) {
        throw new CustomError('Verification failed.', 400);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updatedUser = await userDataService.updateUser(
        { _id: user._id },
        {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordVerificationCode: null,
        }
      );
      if (!updatedUser) {
        throw new CustomError('Failed to update password.', 500);
      }

      return true;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new CustomError('Invalid or expired token', 400);
      }
      throw new CustomError(error.message, error.statusCode || 500);
    }
  }

  async loginUser(email, password) {
    try {
      const user = await userDataService.findUser({ email });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new CustomError('Wrong email or password.', 404);
      }

      if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
          {
            user: {
              name: user.name,
              email: user.email,
              id: user._id,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return { accessToken, user: { name: user.name, email: user.email, id: user._id } };
      }
    } catch (error) {
      throw new CustomError(error.message, error.statusCode || 500);
    }
  }
}

module.exports = new UserService();
