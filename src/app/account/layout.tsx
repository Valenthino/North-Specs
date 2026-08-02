import Link from "next/link";
import { LayoutDashboard, LogIn, Package, ShieldAlert, User } from "lucide-react";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { AccountNav } from "@/components/account/account-nav";
import { getSessionProfile, isSupabaseConfigured } from "@/lib/data/account";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionProfile();

  // Signed-out state (also the case when Supabase isn't configured yet).
  if (!session) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ink-50">
            <User className="h-8 w-8 text-ink-400" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-ink-950">Sign in to your account</h1>
          <p className="mt-2 text-ink-500">
            View your orders, batch documentation and account details.
          </p>

          {!isSupabaseConfigured() && (
            <Alert tone="warning" className="mt-6 text-left">
              <div className="flex items-start gap-1">
                <div>
                  <p className="font-semibold">Supabase not configured</p>
                  <p className="mt-1">
                    Accounts and orders need Supabase. Add your credentials to{" "}
                    <code className="rounded bg-amber-100 px-1">.env.local</code> to enable sign-in.
                  </p>
                </div>
              </div>
            </Alert>
          )}

          <div className="mt-6 flex justify-center gap-3">
            <Link href="/auth/login" className={buttonVariants({ variant: "primary" })}>
              <LogIn className="h-4 w-4" /> Sign in
            </Link>
            <Link href="/auth/register" className={buttonVariants({ variant: "outline" })}>
              Create account
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  const name = session.profile?.full_name || session.email;
  const isStaff = session.profile?.role === "staff" || session.profile?.role === "admin";

  const navItems = [
    { href: "/account", label: "Dashboard", icon: LayoutDashboard },
    { href: "/account/orders", label: "Orders", icon: Package },
    { href: "/account/profile", label: "Profile", icon: User },
  ];

  return (
    <Container className="py-10">
      <div className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="mb-6 lg:mb-0">
          <div className="rounded-2xl border border-ink-100 bg-white p-4 shadow-card">
            <div className="mb-4 flex items-center gap-3 border-b border-ink-100 pb-4">
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-ink-900 text-sm font-bold text-white">
                {(name?.[0] ?? "U").toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-950">{name}</p>
                <p className="truncate text-xs text-ink-500">{session.email}</p>
              </div>
            </div>
            <AccountNav items={navItems} />
            {isStaff && (
              <Link
                href="/admin"
                className="mt-2 flex items-center gap-3 rounded-lg bg-ink-950 px-3 py-2.5 text-sm font-medium text-white hover:bg-ink-800"
              >
                <ShieldAlert className="h-4 w-4 text-frost-300" /> Admin dashboard
              </Link>
            )}
          </div>
        </aside>
        <div>{children}</div>
      </div>
    </Container>
  );
}
