const express = require('express');
const { registerUser, loginUser, verifyAccount, resendVerificationCode, resetPassword, setNewPassword } = require('../controllers/userController');
const { validateUserRegister, validateLogin } = require('../middleware/validate/validateAuthData');

const userRouter = express.Router();

userRouter.post('/register', validateUserRegister, registerUser);

userRouter.post('/verify', verifyAccount);

userRouter.post('/resend-verification', resendVerificationCode);

userRouter.post('/reset-password', resetPassword);

userRouter.post('/send-new-password', setNewPassword);

userRouter.post('/login', validateLogin, loginUser);

module.exports = userRouter;
