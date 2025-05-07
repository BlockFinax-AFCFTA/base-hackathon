import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface NotFoundProps {
  customMessage?: string;
}

export default function NotFound({ customMessage }: NotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        {customMessage || "Sorry, the page you're looking for doesn't exist or has been moved."}
      </p>
      <Button asChild>
        <Link href="/">
          Return to Home
        </Link>
      </Button>
    </div>
  );
}