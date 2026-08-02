import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "default" | "frost" | "aurora" | "ink" | "amber" | "outline" | "red";

const tones: Record<Tone, string> = {
  default: "bg-ink-100 text-ink-700",
  frost: "bg-frost-100 text-frost-800",
  aurora: "bg-aurora-100 text-aurora-800",
  ink: "bg-ink-900 text-white",
  amber: "bg-amber-100 text-amber-800",
  red: "bg-red-100 text-red-700",
  outline: "border border-ink-200 text-ink-700",
};

export function Badge({
  tone = "default",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
