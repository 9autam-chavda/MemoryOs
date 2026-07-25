import api from "./api";

const register = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

const login = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

const verifyEmail = async (data) => {
  const response = await api.post(
    "/auth/verify-email",
    data
  );

  return response.data;
};

const resendVerificationOtp = async (email) => {
  const response = await api.post(
    "/auth/resend-verification-otp",
    {
      email,
    }
  );

  return response.data;
};

const forgotPassword = async (email) => {
  const response = await api.post(
    "/auth/forgot-password",
    {
      email,
    }
  );

  return response.data;
};

const resetPassword = async (data) => {
  const response = await api.post(
    "/auth/reset-password",
    data
  );

  return response.data;
};

export default {
  register,
  login,
  verifyEmail,
  resendVerificationOtp,
  forgotPassword,
  resetPassword,
};