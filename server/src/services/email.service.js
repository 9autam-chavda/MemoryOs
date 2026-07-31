const axios = require("axios");

class EmailService {
  constructor() {
    this.client = axios.create({
      baseURL: "https://api.brevo.com/v3",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });
  }

  async sendMail({ to, subject, html }) {
    try {
      const response = await this.client.post("/smtp/email", {
        sender: {
          name: "MemoryOS",
          email: "memoryos.otp@gmail.com",
        },
        to: [
          {
            email: to,
          },
        ],
        subject,
        htmlContent: html,
      });

      console.log("✅ Email sent:", response.data);

      return response.data;
    } catch (error) {
      console.error(
        "Brevo Error:",
        error.response?.data || error.message
      );

      throw new Error("Unable to send email.");
    }
  }

  async sendVerificationOTP(email, otp) {
    return this.sendMail({
      to: email,
      subject: "Verify your MemoryOS account",
      html: `
        <h2>Welcome to MemoryOS</h2>

        <p>Your verification code is:</p>

        <h1 style="letter-spacing:6px;">${otp}</h1>

        <p>This code expires in <b>10 minutes</b>.</p>
      `,
    });
  }

  async sendResetPasswordOTP(email, otp) {
    return this.sendMail({
      to: email,
      subject: "Reset your MemoryOS password",
      html: `
        <h2>Reset Password</h2>

        <p>Your password reset code is:</p>

        <h1 style="letter-spacing:6px;">${otp}</h1>

        <p>This code expires in <b>10 minutes</b>.</p>
      `,
    });
  }
}

module.exports = new EmailService();