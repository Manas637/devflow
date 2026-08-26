import React from "react";
import {
  Heading,
  Text,
} from "@react-email/components";

import EmailLayout from "./layouts/EmailLayout.jsx";
import EmailButton from "./layouts/EmailButton.jsx";

export default function ResetPassword({
  name,
  resetUrl,
}) {
  return (
    <EmailLayout
      preview="Reset your DevFlow password"
    >
      <Heading>
        Reset your password
      </Heading>

      <Text>
        Hi {name},
      </Text>

      <Text>
        We received a request to reset the password
        for your DevFlow account.
      </Text>

      <Text>
        Click the button below to choose a new password.
      </Text>

      <EmailButton href={resetUrl}>
        Reset Password
      </EmailButton>

      <Text>
        This link expires in 1 hour.
      </Text>

      <Text>
        If you didn't request a password reset, you can
        safely ignore this email.
      </Text>
    </EmailLayout>
  );
}