const express = require('express');
const { registerUser, loginUser, test, verifyAccount, resendVerificationCode, resetPassword, setNewPassword } = require('../controllers/userController');
const { validateUserRegister, validateLogin } = require('../middleware/validate/validateAuthData');
const validateToken = require('../middleware/validateTokenHandler');

const userRouter = express.Router();

userRouter.post('/register', validateUserRegister, registerUser);

userRouter.post('/verify', verifyAccount);

userRouter.post('/resend-verification', resendVerificationCode);

userRouter.post('/reset-password', resetPassword);

userRouter.post('/send-new-password', setNewPassword);

userRouter.post('/login', validateLogin, loginUser);

userRouter.get('/test', validateToken, test); //for testing

module.exports = userRouter;
