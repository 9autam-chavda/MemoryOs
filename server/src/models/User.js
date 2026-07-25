const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    verificationOtpHash: {
      type: String,
      default: null,
    },

    verificationOtpExpiresAt: {
      type: Date,
      default: null,
    },

    resetPasswordOtpHash: {
      type: String,
      default: null,
    },

    resetPasswordOtpExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);