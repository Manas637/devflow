import transporter from "./mailer.js";
import env from "../../config/env.js";

import { render } from "@react-email/render";

import VerifyEmail from "../../email/VerifyEmail.jsx";
import ResetPassword from "../../email/ResetPassword.jsx";

class MailService {
  async send({
    to,
    subject,
    react,
  }) {
    if (!to) {
      throw new Error(
        "Email recipient is required."
      );
    }

    if (!env.MAIL_FROM) {
      throw new Error(
        "MAIL_FROM is not configured."
      );
    }

    const html = await render(react);

    return transporter.sendMail({
      from: env.MAIL_FROM,
      to,
      subject,
      html,
    });
  }

  async sendVerificationEmail({
    user,
    token,
  }) {
    const verificationUrl =
      `${env.CLIENT_URL}/verify-email?token=${encodeURIComponent(token)}`;

    return this.send({
      to: user.email,
      subject: "Verify your DevFlow account",
      react: VerifyEmail({
        name: user.name,
        verificationUrl,
      }),
    });
  }

  async sendPasswordResetEmail({
    user,
    token,
  }) {
    const resetUrl =
      `${env.CLIENT_URL}/reset-password?token=${encodeURIComponent(token)}`;

    return this.send({
      to: user.email,
      subject: "Reset your DevFlow password",
      react: ResetPassword({
        name: user.name,
        resetUrl,
      }),
    });
  }
}

export default new MailService();