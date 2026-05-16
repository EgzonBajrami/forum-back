const bcrypt = require("bcrypt");
const usersModel = require("../models/users.models");
const constants = require("./constants");

const REQUIRED_ENV_KEYS = [
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "ADMIN_USERNAME",
  "ADMIN_FIRST_NAME",
  "ADMIN_LAST_NAME",
];

const resolveSaltRounds = () => {
  const raw = process.env.SALT_ROUNDS || process.env.SALT || "10";
  const parsed = Number.parseInt(raw, 10);

  if (Number.isNaN(parsed) || parsed <= 0) {
    throw new Error("Invalid SALT_ROUNDS/SALT value for admin bootstrap.");
  }

  return parsed;
};

const buildAdminPayload = (hashedPassword) => ({
  email: process.env.ADMIN_EMAIL.trim().toLowerCase(),
  password: hashedPassword,
  username: process.env.ADMIN_USERNAME.trim(),
  firstName: process.env.ADMIN_FIRST_NAME.trim(),
  lastName: process.env.ADMIN_LAST_NAME.trim(),
  role: constants.role.ADMIN,
  verified: true,
  age: process.env.ADMIN_AGE ? Number.parseInt(process.env.ADMIN_AGE, 10) : 18,
});

const assertAdminEnv = () => {
  const missing = REQUIRED_ENV_KEYS.filter(
    (key) => !process.env[key] || !process.env[key].trim(),
  );

  if (missing.length > 0) {
    throw new Error(
      `Admin bootstrap missing required env values: ${missing.join(", ")}`,
    );
  }
};

module.exports = async function ensureAdminUser() {
  const existingAdmin = await usersModel
    .findOne({ role: constants.role.ADMIN })
    .lean()
    .exec();

  if (existingAdmin) {
    return;
  }

  assertAdminEnv();

  const saltRounds = resolveSaltRounds();
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD,
    saltRounds,
  );

  await usersModel.create(buildAdminPayload(hashedPassword));
  console.log(
    "No admin found. Bootstrapped admin user from environment variables.",
  );
};
