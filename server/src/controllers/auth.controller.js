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
        "User registered successfully",
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

module.exports = {
    register,
    login,
};