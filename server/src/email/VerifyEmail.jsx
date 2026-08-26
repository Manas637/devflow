import React from "react";

import {
  Heading,
  Text,
} from "@react-email/components";

import EmailLayout from "./layouts/EmailLayout.jsx";

import EmailButton from "./layouts/EmailButton.jsx";

export default function VerifyEmail({
  name,
  verificationUrl,
}) {
  return (
    <EmailLayout
      preview="Verify your DevFlow account"
    >
      <Heading>

        Welcome to DevFlow

      </Heading>

      <Text>

        Hi {name},

      </Text>

      <Text>

        Thanks for creating your account.

        Please verify your email by clicking below.

      </Text>

      <EmailButton
        href={verificationUrl}
      >
        Verify Email
      </EmailButton>

      <Text>
        This link expires in 24 hours.
      </Text>

    </EmailLayout>
  );
}