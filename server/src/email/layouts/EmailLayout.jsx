import React from "react";

import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export default function EmailLayout({
  preview,
  children,
}) {
  return (
    <Html>

      <Head />

      <Preview>{preview}</Preview>

      <Body
        style={{
          background: "#f8fafc",
          fontFamily:
            "Inter, Arial, sans-serif",
        }}
      >
        <Container
          style={{
            background: "#ffffff",
            borderRadius: "12px",
            padding: "40px",
            maxWidth: "600px",
            margin: "40px auto",
            border: "1px solid #e5e7eb",
          }}
        >
          {children}

          <Hr />

          <Section>

            <Text
              style={{
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              DevFlow

              <br />

              Build software faster.
            </Text>

          </Section>

        </Container>

      </Body>

    </Html>
  );
}