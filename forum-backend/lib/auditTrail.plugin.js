const AuditLog = require("../models/auditLog.model");

const logAudit = async (entry) => {
  try {
    await AuditLog.create(entry);
  } catch (error) {
    console.error("Audit log write failed:", error.message);
  }
};

module.exports = function auditTrail(schema) {
  const base = (model, operation) => ({
    model: model.modelName,
    collectionName: model.collection.name,
    operation,
  });

  schema.post("save", async function (doc) {
    const operation = doc.isNew ? "create" : "save";

    await logAudit({
      ...base(this.constructor, operation),
      documentId: doc._id ? String(doc._id) : undefined,
      after: doc.toObject({ depopulate: true }),
    });
  });

  schema.pre("findOneAndUpdate", async function () {
    this._auditBefore = await this.model.findOne(this.getQuery()).lean();
  });

  schema.post("findOneAndUpdate", async function () {
    const afterDoc = await this.model.findOne(this.getQuery()).lean();

    await logAudit({
      ...base(this.model, "findOneAndUpdate"),
      documentId: afterDoc?._id ? String(afterDoc._id) : undefined,
      filter: this.getQuery(),
      update: this.getUpdate(),
      before: this._auditBefore || null,
      after: afterDoc || null,
    });
  });

  schema.pre("findOneAndDelete", async function () {
    this._auditBefore = await this.model.findOne(this.getQuery()).lean();
  });

  schema.post("findOneAndDelete", async function () {
    await logAudit({
      ...base(this.model, "findOneAndDelete"),
      documentId: this._auditBefore?._id
        ? String(this._auditBefore._id)
        : undefined,
      filter: this.getQuery(),
      before: this._auditBefore || null,
      after: null,
    });
  });

  schema.post("updateOne", async function () {
    await logAudit({
      ...base(this.model, "updateOne"),
      filter: this.getQuery(),
      update: this.getUpdate(),
    });
  });

  schema.post("updateMany", async function () {
    await logAudit({
      ...base(this.model, "updateMany"),
      filter: this.getQuery(),
      update: this.getUpdate(),
    });
  });

  schema.post("deleteOne", async function () {
    await logAudit({
      ...base(this.model, "deleteOne"),
      filter: this.getQuery(),
    });
  });

  schema.post("deleteMany", async function () {
    await logAudit({
      ...base(this.model, "deleteMany"),
      filter: this.getQuery(),
    });
  });
};
