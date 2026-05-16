const userService = require("../services/user.services");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");
const refreshTokenModel = require("../models/refreshToken.model");

const ACCESS_TOKEN_TTL_SECONDS = 60 * 60;
const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

const buildAccessToken = (userId) =>
  jwt.sign(
    {
      _id: userId,
      exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_TTL_SECONDS,
    },
    process.env.JWT_SECRET,
  );

const buildRefreshToken = (userId) =>
  jwt.sign(
    {
      _id: userId,
      exp: Math.floor(Date.now() / 1000) + REFRESH_TOKEN_TTL_SECONDS,
    },
    process.env.REFRESH_JWT_SECRET,
  );

module.exports = {
  login: async (params) => {
    const { email, password } = params;

    const user = await userService.findByEmail(email);
    if (!user) {
      throw Error("User does not exist");
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw Error("Password is incorrect");
    }
    const token = buildAccessToken(user._id);
    const refreshToken = buildRefreshToken(user._id);

    await refreshTokenModel.create({
      token: refreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000),
    });

    return {
      token,
      refreshToken,
      role: user.role,
    };
  },
  refreshToken: async (params) => {
    const { refreshToken } = params;
    if (!refreshToken) {
      throw Error("Refresh token is required");
    }

    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
    } catch (error) {
      throw Error("Invalid refresh token");
    }

    const storedToken = await refreshTokenModel
      .findOne({ token: refreshToken, user: payload._id, revokedAt: null })
      .exec();

    if (!storedToken) {
      throw Error("Refresh token is revoked or does not exist");
    }

    if (storedToken.expiresAt.getTime() <= Date.now()) {
      await refreshTokenModel
        .findByIdAndUpdate(storedToken._id, { revokedAt: new Date() })
        .exec();
      throw Error("Refresh token expired");
    }

    const user = await userService.findId(payload._id);
    if (!user) {
      throw Error("User does not exist");
    }

    const newAccessToken = buildAccessToken(user._id);
    const newRefreshToken = buildRefreshToken(user._id);

    await refreshTokenModel
      .findByIdAndUpdate(storedToken._id, { revokedAt: new Date() })
      .exec();
    await refreshTokenModel.create({
      token: newRefreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000),
    });

    return {
      token: newAccessToken,
      refreshToken: newRefreshToken,
      role: user.role,
    };
  },
  logout: async (params) => {
    const { refreshToken } = params;
    if (!refreshToken) {
      throw Error("Refresh token is required");
    }

    await refreshTokenModel
      .findOneAndUpdate(
        { token: refreshToken, revokedAt: null },
        { revokedAt: new Date() },
      )
      .exec();

    return { success: true };
  },
  forgotPassword: async (params) => {
    const { email } = params;
    const user = await userService.findByEmail(email);
    if (!user) {
      throw Error("Email does not exist");
    }

    const token = jwt.sign(
      { _id: user._id, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12 },
      process.env.JWT_FORGOT_PASSWORD_SECRET,
    );

    return await emailService.sendForgotPasswordEmail(email, token);
  },
};
