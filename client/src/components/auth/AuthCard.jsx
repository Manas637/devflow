import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AuthCard({
  title,
  description,
  children,
  footer,
}) {
  return (
    <Card className="border-border/60 shadow-xl shadow-black/5 dark:shadow-black/40">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl">
          {title}
        </CardTitle>

        {description && (
          <CardDescription>
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {children}

        {footer}
      </CardContent>
    </Card>
  );
}