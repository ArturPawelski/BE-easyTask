const mongoose = require('mongoose');

const invalidatedTokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

const invalidatedTokenModel = mongoose.model('invalidatedToken', invalidatedTokenSchema);

module.exports = invalidatedTokenModel;
