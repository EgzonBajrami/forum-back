const mongoose = require('mongoose');
const auditTrail = require('../lib/auditTrail.plugin');

const refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    revokedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

refreshTokenSchema.plugin(auditTrail);

const refreshTokenModel = mongoose.model('refresh_tokens', refreshTokenSchema);
module.exports = refreshTokenModel;
