import AuthCard from "./AuthCard";
import AuthHeader from "./AuthHeader";

export default function AuthStatusCard({
  icon,
  title,
  description,
  children,
}) {
  return (
    <AuthCard>
      <div className="space-y-8">
        <AuthHeader
          icon={icon}
          title={title}
          description={description}
        />

        {children && (
          <div className="space-y-3">
            {children}
          </div>
        )}
      </div>
    </AuthCard>
  );
}