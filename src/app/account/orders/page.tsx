import Link from "next/link";
import { Package } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { getSessionProfile, getUserOrders } from "@/lib/data/account";
import { formatCents, formatDate } from "@/lib/utils";

export default async function OrdersPage() {
  const session = await getSessionProfile();
  if (!session) return null;

  const orders = await getUserOrders(session.userId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-950">Order history</h1>
        <p className="mt-1 text-ink-500">All orders placed on your research account.</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-200 px-6 py-16 text-center">
          <Package className="mx-auto h-10 w-10 text-ink-300" />
          <p className="mt-4 font-semibold text-ink-900">No orders yet</p>
          <p className="mt-1 text-sm text-ink-500">Your placed orders will appear here.</p>
          <Link href="/shop" className={buttonVariants({ variant: "primary", className: "mt-4" })}>
            Browse peptides
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 bg-ink-50/50 px-6 py-4">
                <div>
                  <p className="font-mono text-sm font-bold text-ink-950">{order.order_number}</p>
                  <p className="text-xs text-ink-500">Placed {formatDate(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <OrderStatusBadge status={order.status} />
                  <span className="font-bold text-ink-950">{formatCents(order.total_cents)}</span>
                </div>
              </div>
              <ul className="divide-y divide-ink-50">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between px-6 py-3 text-sm">
                    <span className="text-ink-800">
                      {item.product_name}
                      {item.variant_name && <span className="text-ink-500"> · {item.variant_name}</span>}
                      <span className="text-ink-400"> × {item.quantity}</span>
                    </span>
                    <span className="font-medium text-ink-900">{formatCents(item.total_cents)}</span>
                  </li>
                ))}
              </ul>
              {order.po_number && (
                <p className="border-t border-ink-100 px-6 py-2.5 text-xs text-ink-500">
                  PO: <span className="font-medium text-ink-700">{order.po_number}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
