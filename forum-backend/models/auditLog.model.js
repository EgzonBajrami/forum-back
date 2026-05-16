const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    model: { type: String, required: true },
    collectionName: { type: String, required: true },
    operation: {
      type: String,
      required: true,
      enum: [
        "create",
        "save",
        "findOneAndUpdate",
        "findOneAndDelete",
        "updateOne",
        "updateMany",
        "deleteOne",
        "deleteMany",
      ],
    },
    documentId: { type: String },
    filter: { type: mongoose.Schema.Types.Mixed },
    update: { type: mongoose.Schema.Types.Mixed },
    before: { type: mongoose.Schema.Types.Mixed },
    after: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.AuditLog || mongoose.model("AuditLog", auditLogSchema);
