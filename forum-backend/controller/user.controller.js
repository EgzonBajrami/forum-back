const userService = require("../services/user.services.js");
const bcrypt = require("bcrypt");
const emailService = require("../services/email.service");
const jwt = require("jsonwebtoken");
const userModel = require("../models/users.models");
const uploadModel = require("../models/uploads.model");
const deleteService = require("../services/delete.service");
module.exports = {
  add: async (params) => {
    const { password, firstName, lastName, username, age, email } = params;

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT_ROUNDS),
    );

    params.password = hashedPassword;
    const result = await userService.insert(params);
    const token = jwt.sign(
      { _id: result._id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12 },
      process.env.JWT_VERIFY_SECRET,
    );
    emailService.sendRegistrationEmail(email, token);
    return result._id;
  },
  verifyAccount: async (id) => {
    const result = await userService.verifyAccount(id);
    return result._id;
  },
  findUser: async (params) => {
    const userId = params.id;
    const result = await userService.findId(userId);
    return result;
  },
  editUser: async (fields, params) => {
    const userId = params.id;

    const result = await userModel
      .findByIdAndUpdate(userId, {
        firstName: fields[0],
        lastName: fields[1],
        age: fields[2],
        username: fields[3],
        avatar: fields[4],
      })
      .exec();
    return result;
  },
  findByUserName: async (params) => {
    const result = await userModel.find({ username: params.username });
    return result;
  },
  removeUser: async (params) => {
    const deleteComments = await deleteService.removeUserComments(params.id);
    const deletePosts = await deleteService.removeUserPosts(params.id);
    const result = await userModel.findByIdAndDelete(params.id);
    return result;
  },
  changePassword: async (password, id) => {
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALT),
    );
    const result = await userService.updatePassword(id, hashedPassword);
    return result._id;
  },
  uploadAvatar: async (file, params, decoded) => {
    if (!file) {
      throw Error("Avatar file is required");
    }

    const userId = params.id;
    if (decoded !== userId) {
      throw Error("You can only upload avatar for your own account");
    }

    const filePath = `/public/uploads/${file.filename}`;
    const serverUrl = (
      process.env.SERVER_URL || `http://localhost:${process.env.PORT || 4000}`
    ).replace(/\/$/, "");
    const avatarUrl = `${serverUrl}${filePath}`;
    const upload = await uploadModel.create({
      filename: file.filename,
      file_path: filePath,
      file_size: file.size,
      uploaded_by: decoded,
    });

    const result = await userModel
      .findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true })
      .exec();

    return result?.avatar;
  },
};
