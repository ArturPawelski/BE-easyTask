const userModel = require('../../models/userModel');
const invalidatedTokenModel = require('../../models/invalidatedTokenModel');

class UserDataService {
  async findUser(query) {
    return userModel.findOne(query);
  }

  async createUser(data) {
    return userModel.create(data);
  }

  async findUsers(filter = {}) {
    return userModel.find(filter);
  }

  async updateUser(filter, updateData) {
    return userModel.findOneAndUpdate(filter, updateData, { new: true });
  }

  async deleteUser(filter) {
    return userModel.findOneAndDelete(filter);
  }

  async findById(userId) {
    return userModel.findById(userId);
  }

  async updateManyUsers(filter, updateData) {
    return userModel.updateMany(filter, updateData);
  }

  async deleteManyUsers(filter) {
    return userModel.deleteMany(filter);
  }

  async findInvalidatedToken(query) {
    return invalidatedTokenModel.findOne(query);
  }

  async saveInvalidatedToken(data) {
    return invalidatedTokenModel.create(data);
  }
}

module.exports = new UserDataService();
