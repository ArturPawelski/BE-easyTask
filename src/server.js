require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRoutes');

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use('/users', userRouter);

mongoose
  .connect(process.env.MONGO_CONNECT)
  .then(() => console.log('db connected'))
  .catch((er) => console.log(er));

app.listen(process.env.PORT, () => {
  console.log('server runs');
});
