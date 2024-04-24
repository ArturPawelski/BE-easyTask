const { validateUserRegister } = require('../../../middleware/validate/validateAuthData');

describe('Registration Validation Test  ', () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  //register validation
  it('should pass validation for valid data', () => {
    const req = {
      body: {
        name: 'ValidName',
        email: 'valid@example.com',
        confirmEmail: 'valid@example.com',
        password: 'validPassword123',
        confirmPassword: 'validPassword123',
      },
    };

    validateUserRegister(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  //register validation
  it('should return error for invalid data', () => {
    const req = {
      body: {
        notValid: 'No',
      },
    };

    validateUserRegister(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: null,
        success: false,
        message: 'Field "name" is required',
      })
    );
    expect(res.status).toHaveBeenCalledWith(400);
  });

  //register validation
  it('should return error when passwords do not match', () => {
    const req = {
      body: {
        name: 'ValidName',
        email: 'valid@example.com',
        confirmEmail: 'valid@example.com',
        password: 'validPassword123',
        confirmPassword: 'wrongPassword123', // Mismatched password
      },
    };

    validateUserRegister(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: null,
        success: false,
        message: 'Field "confirmPassword" must match the "password"',
      })
    );
  });
});
