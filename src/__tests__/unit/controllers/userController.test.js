const UserService = require('../../../services/user/userService');
const userDataService = require('../../../services/user/userDataService');
const { registerUser } = require('../../../controllers/userController');
const userService = require('../../../services/user/userService');

jest.mock('../../../services/user/userService');
jest.mock('../../../services/user/userDataService');
jest.mock('../../../services/responseDTO', () =>
  jest.fn().mockImplementation((success, data, message) => ({
    success,
    data,
    message,
  }))
);

describe('UserController', () => {
  describe('registerUser', () => {
    let req, res;

    beforeEach(() => {
      req = {
        body: {
          name: 'TestUser',
          email: 'test@example.com',
          password: 'password123',
        },
      };
      res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };
      jest.clearAllMocks();
    });

    //userController
    it('should register a new user successfully', async () => {
      userService.registerUser.mockResolvedValue({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      await registerUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: null,
        message: 'registration completed successfully',
      });
    });

    //userController
    it('should handle errors when registration fails', async () => {
      const error = new Error('User already registered');
      error.statusCode = 409;

      userService.registerUser.mockRejectedValue(error); // simulate an error
      await registerUser(req, res);

      // console.log('JSON called with:', res.json.mock.calls);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        data: null,
        message: 'User already registered',
      });
    });
  });
});
