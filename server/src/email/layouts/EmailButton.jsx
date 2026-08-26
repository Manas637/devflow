import React from "react";

import { Button } from "@react-email/components";

export default function EmailButton({
  href,
  children,
}) {
  return (
    <Button
      href={href}
      style={{
        background: "#0f766e",
        color: "#ffffff",
        padding: "14px 24px",
        borderRadius: "8px",
        fontWeight: "600",
        textDecoration: "none",
      }}
    >
      {children}
    </Button>
  );
}