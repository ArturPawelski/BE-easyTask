const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const userRouter = require('../../routes/userRoutes');

describe('User Controller Integration Tests', () => {
  const app2 = express();
  app2.use(express.json());
  app2.use('/users', userRouter);

  beforeAll(() => {
    server = app2.listen(0, () => {
      console.log('test server runs');
    });
  });

  beforeEach(async () => {
    if (mongoose.connection.readyState) {
      await mongoose.disconnect();
    }
    await mongoose.connect(process.env.MONGO_TESTING_DB_CONNECT);
  });

  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  afterAll((done) => {
    server.close(() => {
      console.log('Server closed');
      done();
    });
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

  it('should login an existing user', async () => {});
});
