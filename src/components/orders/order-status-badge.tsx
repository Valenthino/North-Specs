import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/lib/supabase/database.types";

const config: Record<OrderStatus, { label: string; tone: React.ComponentProps<typeof Badge>["tone"] }> = {
  pending: { label: "Pending review", tone: "amber" },
  awaiting_payment: { label: "Awaiting payment", tone: "amber" },
  paid: { label: "Paid", tone: "frost" },
  processing: { label: "Processing", tone: "frost" },
  shipped: { label: "Shipped", tone: "aurora" },
  delivered: { label: "Delivered", tone: "aurora" },
  cancelled: { label: "Cancelled", tone: "red" },
  refunded: { label: "Refunded", tone: "default" },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const { label, tone } = config[status] ?? config.pending;
  return <Badge tone={tone}>{label}</Badge>;
}
