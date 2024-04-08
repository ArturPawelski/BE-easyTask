const express = require('express');
const { registerUser, loginUser, verifyAccount, resendVerificationCode, resetPassword, setNewPassword, checkSession, logout } = require('../controllers/userController');
const { validateUserRegister, validateLogin, validateVerifyAccount, validateResendVerificationCode } = require('../middleware/validate/validateAuthData');
const validateTokenHanlder = require('../middleware/validateTokenHandler');

const userRouter = express.Router();

userRouter.post('/register', validateUserRegister, registerUser);

userRouter.post('/verify', validateVerifyAccount, verifyAccount);

userRouter.post('/resend-verification', validateResendVerificationCode, resendVerificationCode);

userRouter.post('/reset-password', resetPassword);

userRouter.post('/send-new-password', setNewPassword);

userRouter.post('/login', validateLogin, loginUser);

userRouter.post('/logout', logout);

userRouter.post('/check-session', validateTokenHanlder, checkSession);

module.exports = userRouter;
