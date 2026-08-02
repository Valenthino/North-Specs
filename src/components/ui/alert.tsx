import * as React from "react";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "info" | "success" | "warning" | "error";

const config: Record<Tone, { wrap: string; icon: React.ElementType }> = {
  info: { wrap: "border-frost-200 bg-frost-50 text-frost-900", icon: Info },
  success: { wrap: "border-aurora-200 bg-aurora-50 text-aurora-900", icon: CheckCircle2 },
  warning: { wrap: "border-amber-200 bg-amber-50 text-amber-900", icon: AlertTriangle },
  error: { wrap: "border-red-200 bg-red-50 text-red-800", icon: XCircle },
};

export function Alert({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: Tone;
  title?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const { wrap, icon: Icon } = config[tone];
  return (
    <div className={cn("flex gap-3 rounded-xl border p-4 text-sm", wrap, className)}>
      <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={cn(title && "mt-1", "text-current/90")}>{children}</div>}
      </div>
    </div>
  );
}
