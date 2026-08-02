import Link from "next/link";
import { ArrowRight, Building2, Package, ShieldCheck } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { getSessionProfile, getUserOrders } from "@/lib/data/account";
import { formatCents, formatDate } from "@/lib/utils";

export default async function AccountDashboard({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string; error?: string }>;
}) {
  const { welcome, error } = await searchParams;
  const session = await getSessionProfile();
  if (!session) return null; // layout renders the signed-out state

  const orders = await getUserOrders(session.userId);
  const recent = orders.slice(0, 3);

  return (
    <div className="space-y-6">
      {welcome && (
        <Alert tone="success" title="Welcome to North Specs">
          Your research account is ready. Browse the catalogue to place your first order.
        </Alert>
      )}
      {error === "not-authorized" && (
        <Alert tone="warning">You don&apos;t have access to the admin area.</Alert>
      )}

      <div>
        <h1 className="text-2xl font-bold text-ink-950">
          Welcome back{session.profile?.full_name ? `, ${session.profile.full_name.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-ink-500">Manage your orders and research account.</p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
          <Package className="h-6 w-6 text-frost-600" />
          <p className="mt-3 text-2xl font-bold text-ink-950">{orders.length}</p>
          <p className="text-sm text-ink-500">Total orders</p>
        </div>
        <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
          <Building2 className="h-6 w-6 text-frost-600" />
          <p className="mt-3 truncate text-lg font-bold text-ink-950">
            {session.profile?.organization_name || "—"}
          </p>
          <p className="text-sm text-ink-500">Organization</p>
        </div>
        <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
          <ShieldCheck className="h-6 w-6 text-frost-600" />
          <p className="mt-3 text-lg font-bold capitalize text-ink-950">
            {session.profile?.verification_status ?? "unverified"}
          </p>
          <p className="text-sm text-ink-500">Account status</p>
        </div>
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl border border-ink-100 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
          <h2 className="font-semibold text-ink-950">Recent orders</h2>
          <Link href="/account/orders" className="text-sm font-semibold text-frost-700 hover:underline">
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <p className="text-ink-500">You haven&apos;t placed any orders yet.</p>
            <Link href="/shop" className={buttonVariants({ variant: "primary", className: "mt-4" })}>
              Browse peptides <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-ink-100">
            {recent.map((order) => (
              <li key={order.id} className="flex items-center justify-between gap-4 px-6 py-4">
                <div>
                  <p className="font-mono text-sm font-semibold text-ink-950">{order.order_number}</p>
                  <p className="text-xs text-ink-500">{formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <OrderStatusBadge status={order.status} />
                  <span className="font-semibold text-ink-950">{formatCents(order.total_cents)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
