import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { OrderStatusForm } from "@/components/admin/order-status-form";
import { getAdminOrderById } from "@/lib/data/admin";
import { updateOrderStatusAction } from "../../actions";
import { formatCents, formatDate } from "@/lib/utils";

function AddressBlock({ address }: { address: unknown }) {
  if (!address || typeof address !== "object") return <p className="text-sm text-ink-400">—</p>;
  const a = address as Record<string, string>;
  return (
    <address className="text-sm not-italic leading-relaxed text-ink-700">
      {a.recipient_name && <div className="font-medium text-ink-900">{a.recipient_name}</div>}
      {a.organization && <div>{a.organization}</div>}
      {a.line1 && <div>{a.line1}</div>}
      {a.line2 && <div>{a.line2}</div>}
      <div>
        {[a.city, a.province, a.postal_code].filter(Boolean).join(", ")}
      </div>
      {a.country && <div>{a.country}</div>}
      {a.phone && <div className="mt-1 text-ink-500">{a.phone}</div>}
    </address>
  );
}

export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getAdminOrderById(id);
  if (!order) notFound();

  const boundUpdate = updateOrderStatusAction.bind(null, order.id);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-sm font-semibold text-frost-700 hover:underline">
        <ArrowLeft className="h-4 w-4" /> Orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-mono text-2xl font-bold text-ink-950">{order.order_number}</h1>
          <p className="mt-1 text-sm text-ink-500">Placed {formatDate(order.placed_at ?? order.created_at)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Items + totals */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
            <div className="border-b border-ink-100 px-6 py-4">
              <h2 className="font-semibold text-ink-950">Items</h2>
            </div>
            <ul className="divide-y divide-ink-100">
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between px-6 py-3 text-sm">
                  <div>
                    <p className="font-medium text-ink-900">{item.product_name}</p>
                    <p className="text-ink-500">
                      {item.variant_name} · SKU {item.sku} · {formatCents(item.unit_price_cents)} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold text-ink-950">{formatCents(item.total_cents)}</span>
                </li>
              ))}
            </ul>
            <dl className="space-y-1.5 border-t border-ink-100 bg-ink-50/50 px-6 py-4 text-sm">
              <div className="flex justify-between text-ink-600">
                <dt>Subtotal</dt>
                <dd>{formatCents(order.subtotal_cents)}</dd>
              </div>
              <div className="flex justify-between text-ink-600">
                <dt>Shipping</dt>
                <dd>{order.shipping_cents === 0 ? "Free" : formatCents(order.shipping_cents)}</dd>
              </div>
              <div className="flex justify-between text-ink-600">
                <dt>Tax</dt>
                <dd>{formatCents(order.tax_cents)}</dd>
              </div>
              <div className="flex justify-between border-t border-ink-200 pt-2 text-base font-bold text-ink-950">
                <dt>Total</dt>
                <dd>{formatCents(order.total_cents)}</dd>
              </div>
            </dl>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
              <h3 className="mb-2 text-sm font-semibold text-ink-950">Customer</h3>
              <p className="text-sm text-ink-700">{order.email}</p>
              {order.po_number && (
                <p className="mt-2 text-xs text-ink-500">
                  PO: <span className="font-medium text-ink-700">{order.po_number}</span>
                </p>
              )}
              {order.customer_notes && (
                <p className="mt-2 rounded-lg bg-ink-50 p-2 text-xs text-ink-600">{order.customer_notes}</p>
              )}
            </div>
            <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
              <h3 className="mb-2 text-sm font-semibold text-ink-950">Shipping address</h3>
              <AddressBlock address={order.shipping_address} />
            </div>
          </div>
        </div>

        {/* Status control */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
            <h2 className="mb-4 font-semibold text-ink-950">Manage order</h2>
            <OrderStatusForm
              action={boundUpdate}
              currentStatus={order.status}
              internalNotes={order.internal_notes}
            />
          </div>
          <div className="rounded-2xl border border-ink-100 bg-white p-5 text-sm shadow-card">
            <div className="flex justify-between py-1">
              <span className="text-ink-500">Payment</span>
              <Badge tone={order.payment_status === "paid" ? "aurora" : "amber"}>
                {order.payment_status}
              </Badge>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-ink-500">Currency</span>
              <span className="text-ink-800">{order.currency}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
