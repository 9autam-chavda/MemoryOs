const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

class EmailService {
  async sendMail({ to, subject, html }) {
    try {
      console.log("======= SEND EMAIL =======");
      console.log("TO:", to);

      const response = await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
      });

      console.log("EMAIL SENT");
      console.log(response);

      return response;
    } catch (error) {
      console.error("EMAIL FAILED");
      console.error(error);

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

        <p>If you didn't create this account, you can safely ignore this email.</p>
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

        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
  }
}

module.exports = new EmailService();