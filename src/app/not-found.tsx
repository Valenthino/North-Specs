import Link from "next/link";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-center py-24 text-center">
      <p className="font-display text-6xl font-bold text-frost-500">404</p>
      <h1 className="mt-4 text-2xl font-bold text-ink-950">Page not found</h1>
      <p className="mt-2 max-w-md text-ink-500">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className={buttonVariants({ variant: "primary" })}>
          Back to home
        </Link>
        <Link href="/shop" className={buttonVariants({ variant: "outline" })}>
          Browse peptides
        </Link>
      </div>
    </Container>
  );
}
