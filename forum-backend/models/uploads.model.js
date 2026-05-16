const mongoose = require('mongoose');
const auditTrail = require('../lib/auditTrail.plugin');

const uploadSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
      trim: true
    },
    file_path: {
      type: String,
      required: true,
      trim: true
    },
    file_size: {
      type: Number,
      required: true,
      min: 1
    },
    uploaded_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    }
  },
  {
    timestamps: true
  }
);

uploadSchema.plugin(auditTrail);

const uploadModel = mongoose.model('uploads', uploadSchema);
module.exports = uploadModel;
