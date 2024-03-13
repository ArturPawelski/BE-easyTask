const userModel = require('../../models/userModel');

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
}

module.exports = new UserDataService();
