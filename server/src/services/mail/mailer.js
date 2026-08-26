import { google } from "googleapis";

import env from "../../config/env.js";

const oauth2Client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET
);

oauth2Client.setCredentials({
  refresh_token: env.GOOGLE_REFRESH_TOKEN,
});

const gmail = google.gmail({
  version: "v1",
  auth: oauth2Client,
});

function createRawMessage({
  to,
  from,
  subject,
  html,
}) {
  const message = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "",
    html,
  ].join("\r\n");

  return Buffer.from(message).toString("base64url");
}

const mailer = {
  async sendMail({
    from,
    to,
    subject,
    html,
  }) {
    const raw = createRawMessage({
      from,
      to,
      subject,
      html,
    });

    return gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw,
      },
    });
  },
};

export default mailer;