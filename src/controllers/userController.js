const createResponse = require('../services/responseDTO');
const UserService = require('../services/user/userService');

//@desc register a user
//@route POST /users/register
//@access public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

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
  try {
    const { token } = req.query;
    const { code } = req.body;

    await UserService.verifyAccount(token, code);
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
  try {
    const { email } = req.body;

    await UserService.resendVerificationCode(email);
    res.status(200).json(createResponse(true, null, 'Verification code resent successfully. Please check your email.'));
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Something went wrong.';
    return res.status(statusCode).json(createResponse(false, null, message));
  }
};

//@desc reset user password
//@route POST /users/reset-password
//@access public
const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    await UserService.resetPassword(email);
    res.status(200).json(createResponse(true, null, 'If your email address is registered in our system, you will receive a password reset link shortly.'));
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Something went wrong during the password reset process.';
    return res.status(statusCode).json(createResponse(false, null, message));
  }
};

//@desc change user password
//@route POST /users/send-new-password
//@access public
const setNewPassword = async (req, res) => {
  try {
    const { token } = req.query;
    const { verificationCode, newPassword } = req.body;

    await UserService.updatePassword(verificationCode, newPassword, token);
    res.status(200).json(createResponse(true, null, 'Your password has been successfully updated.'));
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Failed to update the password. ';
    res.status(statusCode).json(createResponse(false, null, message));
  }
};

//@desc login a user
//@route POST /users/login
//@access public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { accessToken, user } = await UserService.loginUser(email, password);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json(createResponse(true, { user }, 'Login successful'));
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Something went wrong.';
    return res.status(statusCode).json(createResponse(false, null, message));
  }
};

//@desc check if user is logged in
//@route POST /users/check-session
//@access public/private
const checkSession = async (req, res) => {
  try {
    if (req.user) {
      res.status(200).json(createResponse(true, { user: req.user }, 'User is logged in.'));
    } else {
      res.status(401).json(createResponse(false, null, 'User is not logged in.'));
    }
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Something went wrong.';
    return res.status(statusCode).json(createResponse(false, null, message));
  }
};

//@desc logout
//@route POST /users/logout
//@access private
const logout = async (req, res) => {
  try {
    if (req.user) return true;
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Something went wrong.';
    return res.status(statusCode).json(createResponse(false, null, message));
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyAccount,
  resendVerificationCode,
  resetPassword,
  setNewPassword,
  checkSession,
  logout,
};
