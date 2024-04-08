const mongoose = require('mongoose');

const invalidatedTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      ref: 'Users',
    },
  },
  { timestamps: true }
);

const invalidatedToken = mongoose.model('invalidatedToken', invalidatedTokenSchema);

module.exports = invalidatedToken;
