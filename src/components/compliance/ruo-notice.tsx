import { FlaskConical, ShieldAlert } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** Thin always-visible strip at the very top of the site. */
export function TopComplianceBar() {
  return (
    <div className="bg-ink-950 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-[11px] font-medium tracking-wide sm:text-xs">
        <FlaskConical className="h-3.5 w-3.5 flex-shrink-0 text-frost-300" aria-hidden />
        <span className="uppercase tracking-[0.12em] text-white/90">
          Research Use Only · Not for human or veterinary use · Canadian labs &amp; researchers
        </span>
      </div>
    </div>
  );
}

/** Inline research-use-only notice block for product & checkout pages. */
export function RuoNotice({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-900",
        className,
      )}
    >
      <ShieldAlert className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" aria-hidden />
      <div className="text-sm">
        <p className="font-semibold">{siteConfig.compliance.ruoLong}</p>
        {!compact && (
          <p className="mt-1 text-amber-800/90">{siteConfig.compliance.disclaimer}</p>
        )}
      </div>
    </div>
  );
}
