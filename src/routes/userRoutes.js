const express = require('express');
const { registerUser, loginUser, verifyAccount, resendVerificationCode, resetPassword, setNewPassword, checkSession, logout } = require('../controllers/userController');
const { validateUserRegister, validateLogin, validateVerifyAccount, validateResendVerificationCode, validateResetPassword, validateSetNewPassword } = require('../middleware/validate/validateAuthData');
const validateTokenHanlder = require('../middleware/validateTokenHandler');

const userRouter = express.Router();

userRouter.post('/register', validateUserRegister, registerUser);

userRouter.post('/verify', validateVerifyAccount, verifyAccount);

userRouter.post('/resend-verification', validateResendVerificationCode, resendVerificationCode);

userRouter.post('/reset-password', validateResetPassword, resetPassword);

userRouter.post('/set-new-password', validateSetNewPassword, setNewPassword);

userRouter.post('/login', validateLogin, loginUser);

userRouter.delete('/logout', validateTokenHanlder, logout);

userRouter.get('/check-session', validateTokenHanlder, checkSession);

module.exports = userRouter;
