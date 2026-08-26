import AppearanceSettings from "@/features/user/components/AppearanceSettings";
import ChangePasswordForm from "@/features/user/components/ChangePasswordForm";
import SessionsSection from "@/features/user/components/SessionsSection";

export default function SettingsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Settings
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account security and preferences.
        </p>
      </div>

      <section className="rounded-xl border border-border/60 bg-card">
        {/* Security header */}

        <ChangePasswordForm />
      </section>

      <section className="rounded-xl border border-border/60 bg-card">
        {/* Sessions */}
        <SessionsSection />
      </section>
      <AppearanceSettings />
    </div>
  );
}