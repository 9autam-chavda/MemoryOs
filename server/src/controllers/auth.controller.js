const authService = require(
  "../services/auth.service"
);

const login = async (req, res) => {
  try {
    const result =
      await authService.loginUser(
        req.body
      );

    res.json({
      success: true,
      token: result.token,
      user: {
        id: result.user._id,
        name: result.user.name,
        email: result.user.email,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const register = async (req, res) => {
  try {
    const user =
      await authService.registerUser(
        req.body
      );

    res.status(201).json({
      success: true,
      message:
            "Registration successful. Please verify your email.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const result =
      await authService.verifyEmail(req.body);

    res.json({
      success: true,
      message: "Email verified successfully.",
      token: result.token,
      user: {
        id: result.user._id,
        name: result.user.name,
        email: result.user.email,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const resendVerificationOtp = async (req, res) => {
  try {
    await authService.resendVerificationOtp(req.body);

    res.json({
      success: true,
      message: "Verification OTP sent successfully.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    await authService.forgotPassword(req.body);

    res.json({
      success: true,
      message: "Password reset OTP sent successfully.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    await authService.resetPassword(
      req.body
    );

    res.json({
      success: true,
      message:
        "Password reset successfully.",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
    register,
    login,
    verifyEmail,
    resendVerificationOtp,
    forgotPassword,
    resetPassword,
};