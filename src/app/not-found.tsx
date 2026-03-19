import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
      <h1 className="text-6xl md:text-7xl font-bold text-primary">404</h1>
      <p className="mt-4 text-lg text-text-light text-center max-w-md">
        This page doesn’t exist or has been moved. Head back to the homepage to
        find what you need.
      </p>
      <Button href="/" className="mt-8">
        Back to Home
      </Button>
    </main>
  );
}
