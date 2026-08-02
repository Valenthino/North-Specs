import Link from "next/link";
import { DollarSign, Package, Plus, ShoppingCart, Clock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { getAdminStats, getAdminOrders } from "@/lib/data/admin";
import { formatCents, formatDate } from "@/lib/utils";

export default async function AdminDashboard() {
  const [stats, orders] = await Promise.all([getAdminStats(), getAdminOrders()]);
  const recent = orders.slice(0, 6);

  const cards = [
    { label: "Products", value: String(stats.productCount), icon: Package, href: "/admin/products" },
    { label: "Orders", value: String(stats.orderCount), icon: ShoppingCart, href: "/admin/orders" },
    { label: "Pending review", value: String(stats.pendingOrders), icon: Clock, href: "/admin/orders" },
    { label: "Revenue", value: formatCents(stats.revenueCents), icon: DollarSign, href: "/admin/orders" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-950">Dashboard</h1>
          <p className="mt-1 text-ink-500">Overview of your store.</p>
        </div>
        <Link href="/admin/products/new" className={buttonVariants({ variant: "primary" })}>
          <Plus className="h-4 w-4" /> New product
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card transition-all hover:shadow-card-hover"
          >
            <card.icon className="h-6 w-6 text-frost-600" />
            <p className="mt-3 text-2xl font-bold text-ink-950">{card.value}</p>
            <p className="text-sm text-ink-500">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-ink-100 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
          <h2 className="font-semibold text-ink-950">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-frost-700 hover:underline">
            View all
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="px-6 py-10 text-center text-ink-500">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-left text-xs uppercase tracking-wider text-ink-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Order</th>
                  <th className="px-6 py-3 font-semibold">Customer</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {recent.map((order) => (
                  <tr key={order.id} className="hover:bg-ink-50/50">
                    <td className="px-6 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="font-mono text-xs font-semibold text-frost-700 hover:underline">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-ink-700">{order.email}</td>
                    <td className="px-6 py-3 text-ink-500">{formatDate(order.created_at)}</td>
                    <td className="px-6 py-3"><OrderStatusBadge status={order.status} /></td>
                    <td className="px-6 py-3 text-right font-semibold text-ink-950">
                      {formatCents(order.total_cents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
