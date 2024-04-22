const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const userRouter = require('../../routes/userRoutes');
const bcrypt = require('bcrypt');

describe('User Controller Integration Tests', () => {
  const app2 = express();
  app2.use(express.json());
  app2.use('/users', userRouter);

  beforeAll(async () => {
    if (mongoose.connection.readyState) {
      await mongoose.disconnect();
    }
    await mongoose.connect(process.env.MONGO_TESTING_DB_CONNECT);

    server = app2.listen(0, () => {
      console.log('test server runs');
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();

    await new Promise((resolve) =>
      server.close(() => {
        console.log('Server closed successfully');
        resolve();
      })
    );
  });

  it('should register a new user', async () => {
    const res = await request(server).post('/users/register').send({
      name: 'TestUser',
      email: 'test@example.com',
      confirmEmail: 'test@example.com',
      password: 'test12345678',
      confirmPassword: 'test12345678',
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toEqual(true);
  });

  it('should login a user and send http only token ', async () => {
    await mongoose.model('Users').create({
      name: 'ExistingUser',
      email: 'existing@example.com',
      password: await bcrypt.hash('passwordExample', 10),
      isVerified: true,
    });

    await mongoose.model('Users').updateOne({ email: 'existing@example.com' }, { $set: { isVerified: true } });

    const loginRes = await request(server).post('/users/login').send({
      email: 'existing@example.com',
      password: 'passwordExample',
    });

    expect(loginRes.statusCode).toEqual(200);
    expect(loginRes.body.success).toEqual(true);

    const cookies = loginRes.headers['set-cookie'];
    expect(cookies).toEqual(expect.arrayContaining([expect.stringMatching(/^accessToken=.+;.*HttpOnly/)]));
  });
});
