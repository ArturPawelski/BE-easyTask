const express = require('express');
const { registerUser, loginUser, test } = require('../controllers/userController');
const { validateUserData } = require('../middleware/validateData');
const validateToken = require('../middleware/validateTokenHandler');

const userRouter = express.Router();

userRouter.post('/register', validateUserData, registerUser);

userRouter.post('/login', loginUser);

// userRouter.post('/logout', validateToken, logoutUser);

userRouter.get('/test', validateToken, test); //for testing

module.exports = userRouter;
