const crypto = require("crypto");

class OTPUtil {
  generateOTP() {
    return Math.floor(
      100000 + Math.random() * 900000
    ).toString();
  }

  hashOTP(otp) {
    return crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");
  }

  verifyOTP(otp, hash) {
    return this.hashOTP(otp) === hash;
  }

  getExpiry(minutes = 10) {
    return new Date(
      Date.now() + minutes * 60 * 1000
    );
  }

  isExpired(expiry) {
    return !expiry || expiry < new Date();
  }
}

module.exports = new OTPUtil();