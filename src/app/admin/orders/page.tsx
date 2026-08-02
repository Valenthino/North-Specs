import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { getAdminOrders } from "@/lib/data/admin";
import { formatCents, formatDate } from "@/lib/utils";

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-950">Orders</h1>
        <p className="mt-1 text-ink-500">{orders.length} orders.</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 px-6 py-16 text-center">
          <ShoppingCart className="mx-auto h-10 w-10 text-ink-300" />
          <p className="mt-4 font-semibold text-ink-900">No orders yet</p>
          <p className="mt-1 text-sm text-ink-500">Orders placed in the store will appear here.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-left text-xs uppercase tracking-wider text-ink-500">
                <tr>
                  <th className="px-6 py-3 font-semibold">Order</th>
                  <th className="px-6 py-3 font-semibold">Customer</th>
                  <th className="px-6 py-3 font-semibold">Items</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-ink-50/50">
                    <td className="px-6 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="font-mono text-xs font-semibold text-frost-700 hover:underline">
                        {order.order_number}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-ink-700">{order.email}</td>
                    <td className="px-6 py-3 text-ink-600">{order.items.length}</td>
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
        </div>
      )}
    </div>
  );
}
