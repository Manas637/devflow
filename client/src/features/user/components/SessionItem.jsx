/* eslint-disable react-hooks/static-components */
import {
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";

function getDeviceIcon(userAgent = "") {
  const ua = userAgent.toLowerCase();

  if (ua.includes("mobile") || ua.includes("android")) {
    return Smartphone;
  }

  if (ua.includes("tablet") || ua.includes("ipad")) {
    return Tablet;
  }

  if (
    ua.includes("chrome") ||
    ua.includes("firefox") ||
    ua.includes("safari") ||
    ua.includes("edge")
  ) {
    return Monitor;
  }

  return Globe;
}

function getBrowserName(userAgent = "") {
  if (!userAgent) return "Unknown browser";

  if (userAgent.includes("Edg")) return "Microsoft Edge";
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Safari")) return "Safari";

  return "Unknown browser";
}

function formatLastActive(date) {
  if (!date) return "Unknown";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "Unknown";
  }

  return value.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function SessionItem({
  session,
  isCurrent,
  onRevoke,
  isRevoking,
}) {
  const Icon = getDeviceIcon(session.userAgent);
  const browser = getBrowserName(session.userAgent);

  return (
    <div className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="size-5 text-muted-foreground" />
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-medium">
              {browser}
            </h3>

            {isCurrent && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                Current session
              </span>
            )}
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Last active{" "}
            {formatLastActive(session.lastUsedAt)}
          </p>

          {session.ipAddress && (
            <p className="mt-1 text-xs text-muted-foreground">
              IP address: {session.ipAddress}
            </p>
          )}
        </div>
      </div>

      {!isCurrent && (
        <Button
          variant="outline"
          size="sm"
          disabled={isRevoking}
          onClick={() => onRevoke(session.id)}
        >
          <LogOut className="mr-2 size-4" />
          Revoke
        </Button>
      )}
    </div>
  );
}