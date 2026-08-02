import Link from "next/link";
import { ExternalLink, ShieldAlert } from "lucide-react";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { AdminNav } from "@/components/admin/admin-nav";
import { LogoMark } from "@/components/layout/logo";
import { getSessionProfile, isSupabaseConfigured } from "@/lib/data/account";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSessionProfile();
  const isStaff = session?.profile?.role === "staff" || session?.profile?.role === "admin";

  if (!isStaff) {
    return (
      <Container className="py-16">
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ink-50">
            <ShieldAlert className="h-8 w-8 text-ink-400" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-ink-950">Admin access required</h1>
          <p className="mt-2 text-ink-500">
            This area is restricted to North Specs staff.
          </p>

          {!isSupabaseConfigured() ? (
            <Alert tone="warning" className="mt-6 text-left">
              <p className="font-semibold">Supabase not configured</p>
              <p className="mt-1">
                The admin backend requires Supabase. Add your credentials, apply the migrations, then
                set a user&apos;s <code className="rounded bg-amber-100 px-1">role</code> to{" "}
                <code className="rounded bg-amber-100 px-1">admin</code> in the{" "}
                <code className="rounded bg-amber-100 px-1">profiles</code> table.
              </p>
            </Alert>
          ) : (
            <Alert tone="info" className="mt-6 text-left">
              Your account doesn&apos;t have staff privileges. Ask an administrator to set your{" "}
              <code className="rounded bg-frost-100 px-1">role</code> to{" "}
              <code className="rounded bg-frost-100 px-1">admin</code> in the profiles table.
            </Alert>
          )}

          <div className="mt-6">
            <Link href={session ? "/account" : "/auth/login"} className={buttonVariants({ variant: "primary" })}>
              {session ? "Back to account" : "Sign in"}
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-ink-50/50">
      <div className="lg:grid lg:grid-cols-[240px_1fr]">
        {/* Sidebar */}
        <aside className="bg-ink-950 lg:min-h-[calc(100vh-4rem)]">
          <div className="flex items-center justify-between p-4 lg:flex-col lg:items-stretch lg:gap-6">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                <LogoMark />
              </span>
              <div className="leading-none">
                <p className="font-display text-sm font-bold text-white">North Specs</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-frost-300">
                  Admin
                </p>
              </div>
            </div>
            <div className="hidden lg:block">
              <AdminNav />
            </div>
            <Link
              href="/"
              className="hidden items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-white/50 hover:text-white lg:flex"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View store
            </Link>
          </div>
          <div className="border-t border-white/10 p-4 lg:hidden">
            <AdminNav />
          </div>
        </aside>

        {/* Content */}
        <main className="p-5 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
