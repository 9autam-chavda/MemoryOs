const transporter = require("../config/mail.config");

class EmailService {
  async sendMail({
    to,
    subject,
    html,
  }) {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
  }

  async sendVerificationOTP(email, otp) {
    await this.sendMail({
      to: email,
      subject: "Verify your MemoryOS account",
      html: `
        <h2>Welcome to MemoryOS</h2>

        <p>Your verification code is:</p>

        <h1 style="letter-spacing:6px;">${otp}</h1>

        <p>This code expires in <b>10 minutes</b>.</p>

        <p>If you didn't create this account, you can safely ignore this email.</p>
      `,
    });
  }

  async sendResetPasswordOTP(email, otp) {
    await this.sendMail({
      to: email,
      subject: "Reset your MemoryOS password",
      html: `
        <h2>Reset Password</h2>

        <p>Your password reset code is:</p>

        <h1 style="letter-spacing:6px;">${otp}</h1>

        <p>This code expires in <b>10 minutes</b>.</p>

        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
  }
}

module.exports = new EmailService();