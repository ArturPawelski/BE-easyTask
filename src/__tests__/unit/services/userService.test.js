const userService = require('../../../services/user/userService');
const CustomError = require('../../../utils/customError');
const userDataService = require('../../../services/user/userDataService');
const bcrypt = require('bcrypt');
const { generateToken, verifyToken } = require('../../../utils/tokenUtils');
const { confirmEmail, sendPasswordResetCode } = require('../../../utils/emailUtils');
const { generateRandomCode } = require('../../../utils/randomCodeUtils');

jest.mock('../../../services/user/userDataService');

jest.mock('bcrypt', () => ({
  hash: jest.fn((password) => Promise.resolve(`hashed_${password}`)),
}));

jest.mock('../../../utils/tokenUtils', () => ({
  generateToken: jest.fn(() => 'verificationToken'),
  verifyToken: jest.fn(),
}));

jest.mock('../../../utils/emailUtils', () => ({
  confirmEmail: jest.fn(),
  sendPasswordResetCode: jest.fn(),
}));

jest.mock('../../../utils/randomCodeUtils', () => ({
  generateRandomCode: jest.fn(() => '123456'),
}));

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    userDataService.findUser.mockResolvedValue(false);
    userDataService.createUser.mockImplementation((user) => Promise.resolve({ ...user, id: 'newUserId' }));
  });

  describe('registerUser', () => {
    const mockName = 'testUser';
    const mockEmail = 'test@example.com';
    const mockPassword = 'testPasword123';

    //userService registerUser
    it('should throw an error if user already exists', async () => {
      userDataService.findUser.mockResolvedValue(true); //overwrite

      await expect(userService.registerUser(mockName, mockEmail, mockPassword)).rejects.toThrow(CustomError);
      await expect(userService.registerUser(mockName, mockEmail, mockPassword)).rejects.toHaveProperty('statusCode', 409);
      await expect(userService.registerUser(mockName, mockEmail, mockPassword)).rejects.toHaveProperty('message', 'User already registered');
    });

    it('should create a new user if user does not exist', async () => {
      const user = await userService.registerUser(mockName, mockEmail, mockPassword);

      expect(userDataService.findUser).toHaveBeenCalledWith({ $or: [{ email: mockEmail }, { name: mockName }] });
      expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 10);
      expect(userDataService.createUser).toHaveBeenCalled();
      expect(confirmEmail).toHaveBeenCalledWith(mockEmail, '123456', `${process.env.FRONT_APP_URL}/auth/verify?token=verificationToken`);
      expect(user).toEqual({
        name: mockName,
        email: mockEmail,
        password: `hashed_${mockPassword}`,
        verificationCode: '123456',
        verificationToken: 'verificationToken',
        id: 'newUserId',
      });
    });

    //userService registerUser
    it('should handle errors when user data is not valid', async () => {
      userDataService.createUser.mockResolvedValue(null); //overwrite

      await expect(userService.registerUser(mockName, mockEmail, mockPassword)).rejects.toThrow(CustomError);
      await expect(userService.registerUser(mockName, mockEmail, mockPassword)).rejects.toHaveProperty('statusCode', 400);
      await expect(userService.registerUser(mockName, mockEmail, mockPassword)).rejects.toHaveProperty('message', 'User data is not valid');
    });
  });
});
