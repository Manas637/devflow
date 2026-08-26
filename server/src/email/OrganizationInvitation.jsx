import React from "react";

import {
  Heading,
  Text,
} from "@react-email/components";

import EmailLayout from "./layouts/EmailLayout.jsx";

import EmailButton from "./layouts/EmailButton.jsx";

export default function OrganizationInvitation({
  name,
  organizationName,
  role,
  invitationUrl,
}) {
  return (
    <EmailLayout
      preview={`Invitation to join ${organizationName}`}
    >
      <Heading>
        You're invited to join {organizationName}
      </Heading>

      <Text>
        Hi {name || "there"},
      </Text>

      <Text>
        You have been invited to join{" "}
        <strong>{organizationName}</strong>{" "}
        as a {role.toLowerCase()}.
      </Text>

      <Text>
        Click the button below to view and accept
        the invitation.
      </Text>

      <EmailButton href={invitationUrl}>
        Accept Invitation
      </EmailButton>

      <Text>
        This invitation link will expire according
        to the invitation's expiration time.
      </Text>
    </EmailLayout>
  );
}