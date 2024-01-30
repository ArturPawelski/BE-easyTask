const express = require('express');
const { registerUser, loginUser, test,  testEmail } = require('../controllers/userController');
const { validateUserData } = require('../middleware/validate/validateAuthData');
const validateToken = require('../middleware/validateTokenHandler');

const userRouter = express.Router();

userRouter.post('/register', validateUserData, registerUser);

userRouter.post('/login', loginUser);

// userRouter.post('/logout', validateToken, logoutUser);

userRouter.get('/test', validateToken, test); //for testing
userRouter.post('/emailTest', testEmail ); //for testing

module.exports = userRouter;
