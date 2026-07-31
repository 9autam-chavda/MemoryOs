const brevo = require("@getbrevo/brevo");

class EmailService {
  constructor() {
    this.api = new brevo.TransactionalEmailsApi();

    this.api.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );
  }

  async sendMail({ to, subject, html }) {
    try {
      await this.api.sendTransacEmail({
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

      console.log("Email sent:", to);
    } catch (error) {
      console.error(
        "BREVO ERROR:",
        error.response?.body || error
      );

      throw new Error("Unable to send email.");
    }
  }

  async sendVerificationOTP(email, otp) {
    await this.sendMail({
      to: email,
      subject: "Verify your MemoryOS account",
      html: `
        <h2>Welcome to MemoryOS</h2>

        <p>Your verification code is</p>

        <h1 style="letter-spacing:6px">
          ${otp}
        </h1>

        <p>This code expires in <b>10 minutes</b>.</p>
      `,
    });
  }

  async sendResetPasswordOTP(email, otp) {
    await this.sendMail({
      to: email,
      subject: "Reset your MemoryOS password",
      html: `
        <h2>Reset Password</h2>

        <p>Your OTP is</p>

        <h1 style="letter-spacing:6px">
          ${otp}
        </h1>

        <p>This code expires in <b>10 minutes</b>.</p>
      `,
    });
  }
}

module.exports = new EmailService();