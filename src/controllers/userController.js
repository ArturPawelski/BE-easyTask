require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const createResponse = require('../services/responseDTO');
const { confirmEmail } = require('../utils/emailUtils');
const UserService = require('../services/user/userService');

//@desc register a user
//@route POST /users/register
//@access public

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json(createResponse(false, null, 'all fields are mandatory'));
    }

    const user = await UserService.registerUser(name, email, password);

    res.status(201).json(createResponse(true, user, 'registration completed successfully'));
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Something went wrong.';
    return res.status(statusCode).json(createResponse(false, null, message));
  }
};

//@desc verify User
//@route POST /users/verify
//@access public
const verifyAccount = async (req, res) => {
  const { token } = req.query;
  const { code } = req.body;
  try {
    await UserService.verifyUser(token, code);
    res.status(200).json(createResponse(true, null, 'Account verified successfully'));
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Something went wrong.';
    return res.status(statusCode).json(createResponse(false, null, message));
  }
};

//@desc resend code to verify
//@route POST /users/resend-verification
//@access public
const resendVerificationCode = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json(createResponse(false, null, 'User not found.'));
    }
    if (user.isVerified) {
      return res.status(400).json(createResponse(false, null, 'This account has already been verified.'));
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const verificationToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.VERIFICATION_EXPIRES });

    user.verificationCode = verificationCode;
    user.verificationToken = verificationToken;
    await user.save();

    const verificationLink = `${process.env.FRONT_APP_URL}/verify?token=${verificationToken}`;
    confirmEmail(email, verificationCode, verificationLink);

    res.json(createResponse(true, null, 'Verification code resent successfully. Please check your email.'));
  } catch (error) {
    console.error('Resend Verification Error:', error);
    res.status(500).json(createResponse(false, null, 'Failed to resend verification code.'));
  }
};

//@desc login a user
//@route POST /users/login
//@access public

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json(createResponse(false, null, 'all fields are mandatory'));
    }

    const user = await userModel.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(404).json(createResponse(false, null, 'wrong password or name'));
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign(
        {
          user: {
            name: user.name,
            email: user.email,
            id: user.id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

      const responseUser = {
        name: user.name,
        email: user.email,
        id: user.id,
      };

      res.status(200).json(createResponse(true, { accessToken, user: responseUser }, 'login successful'));
    }
  } catch (error) {
    console.log('error', error);
    res.status(500).json(createResponse(false, null, 'something went wrong'));
  }
};

//@desc test for authorization
//@route GET /users/test
//@access private

const test = async (req, res) => {
  try {
    req.user;
    res.status(200).json(createResponse(true, req.user, 'authorization was successfully'));
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

module.exports = {
  registerUser,
  loginUser,
  test,
  verifyAccount,
  resendVerificationCode,
};
