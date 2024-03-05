const express = require('express');
const { registerUser, loginUser, test, verifyAccount, resendVerificationCode } = require('../controllers/userController');
const { validateUserData } = require('../middleware/validate/validateAuthData');
const validateToken = require('../middleware/validateTokenHandler');

const userRouter = express.Router();

userRouter.post('/register', validateUserData, registerUser);

userRouter.post('/verify', verifyAccount);

userRouter.post('/resend-verification', resendVerificationCode);

userRouter.post('/login', loginUser);

userRouter.get('/test', validateToken, test); //for testing

module.exports = userRouter;
