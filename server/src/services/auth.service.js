const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const otpUtil = require("../utils/otp.util");
const emailService = require("./email.service");

const loginUser = async ({
  email,
  password,
}) => {
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch =
    await bcrypt.compare(
      password,
      user.password
    );

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  if (!user.emailVerified) {
    throw new Error(
      "Please verify your email before logging in."
    );
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user,
  };
};

const registerUser = async ({
  name,
  email,
  password,
}) => {
  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const otp = otpUtil.generateOTP();

  const otpHash = otpUtil.hashOTP(otp);

  const otpExpiry =
    otpUtil.getExpiry();

  const user = await User.create({
    name,
    email,
    password: hashedPassword,

    emailVerified: false,

    verificationOtpHash: otpHash,

    verificationOtpExpiresAt:
      otpExpiry,
  });

  await emailService.sendVerificationOTP(
    email,
    otp
  );

  return user;
};

const verifyEmail = async ({ email, otp }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.emailVerified) {
    throw new Error("Email is already verified.");
  }

  if (
    otpUtil.isExpired(user.verificationOtpExpiresAt)
  ) {
    throw new Error("OTP has expired.");
  }

  const isValid = otpUtil.verifyOTP(
    otp,
    user.verificationOtpHash
  );

  if (!isValid) {
    throw new Error("Invalid OTP.");
  }

  user.emailVerified = true;

  user.verificationOtpHash = null;
  user.verificationOtpExpiresAt = null;

  await user.save();

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return {
    token,
    user,
  };
};

const resendVerificationOtp = async ({ email }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.emailVerified) {
    throw new Error("Email is already verified.");
  }

  const otp = otpUtil.generateOTP();

  user.verificationOtpHash = otpUtil.hashOTP(otp);
  user.verificationOtpExpiresAt = otpUtil.getExpiry();

  await user.save();

  await emailService.sendVerificationOTP(
    user.email,
    otp
  );

  return;
};

const forgotPassword = async ({ email }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found.");
  }

  const otp = otpUtil.generateOTP();

  user.resetPasswordOtpHash =
    otpUtil.hashOTP(otp);

  user.resetPasswordOtpExpiresAt =
    otpUtil.getExpiry();

  await user.save();

  await emailService.sendResetPasswordOTP(
    user.email,
    otp
  );
};

const resetPassword = async ({
  email,
  otp,
  newPassword,
}) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found.");
  }

  if (
    otpUtil.isExpired(
      user.resetPasswordOtpExpiresAt
    )
  ) {
    throw new Error("OTP has expired.");
  }

  const valid = otpUtil.verifyOTP(
    otp,
    user.resetPasswordOtpHash
  );

  if (!valid) {
    throw new Error("Invalid OTP.");
  }

  user.password = await bcrypt.hash(
    newPassword,
    10
  );

  user.resetPasswordOtpHash = null;
  user.resetPasswordOtpExpiresAt = null;

  await user.save();
};

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  resendVerificationOtp,
  forgotPassword,
  resetPassword,
};