import Link from "next/link";
import { CheckCircle2, Mail } from "lucide-react";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { siteConfig } from "@/config/site";

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; demo?: string }>;
}) {
  const { order, demo } = await searchParams;

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-aurora-100">
          <CheckCircle2 className="h-9 w-9 text-aurora-600" />
        </div>
        <h1 className="mt-6 text-3xl font-bold text-ink-950">Order received</h1>
        <p className="mt-2 text-ink-600">
          Thank you. Your research order has been recorded and will be reviewed before dispatch.
        </p>

        {order && (
          <div className="mt-6 inline-flex flex-col rounded-2xl border border-ink-100 bg-white px-8 py-5 shadow-card">
            <span className="text-xs uppercase tracking-wider text-ink-400">Order number</span>
            <span className="font-mono text-2xl font-bold text-ink-950">{order}</span>
          </div>
        )}

        {demo && (
          <Alert tone="info" className="mt-6 text-left">
            <strong>Demo mode:</strong> Supabase isn&apos;t configured yet, so this order was
            simulated and not saved to a database. Add your Supabase credentials and apply the
            migrations to persist real orders.
          </Alert>
        )}

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-ink-500">
          <Mail className="h-4 w-4" />
          A confirmation will be sent to your email once order emails (Resend) are connected.
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/shop" className={buttonVariants({ variant: "primary" })}>
            Continue shopping
          </Link>
          <Link href="/account/orders" className={buttonVariants({ variant: "outline" })}>
            View my orders
          </Link>
        </div>

        <p className="mt-8 text-xs text-ink-400">
          {siteConfig.compliance.ruoLong}
        </p>
      </div>
    </Container>
  );
}
