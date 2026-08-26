import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AuthCard({
  title,
  description,
  children,
  footer,
  className
}) {
  return (
    <Card className={`w-full overflow-hidden ${className}`}>
      <CardHeader className="space-y-1 text-center">
        <CardTitle>{title}</CardTitle>
        {description && (
          <CardDescription>
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && (
        <CardFooter className="justify-center">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}