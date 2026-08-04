import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * North Specs mark — the brand hexagon from the vial labels, with the "N"
 * cut through the centre and a molecular node at each shoulder.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("h-9 w-9", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M20 2.6 L34.4 11 V29 L20 37.4 L5.6 29 V11 Z"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M14.6 27.2 V13.2 L25.4 26.8 V12.8"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="34.4" cy="11" r="1.9" fill="currentColor" />
      <circle cx="5.6" cy="29" r="1.9" fill="currentColor" />
    </svg>
  );
}

export function Logo({
  className,
  variant = "dark",
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="North Specs Labs — home"
    >
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
          variant === "dark" ? "bg-ink-950 text-frost-300" : "bg-white/10 text-frost-300",
        )}
      >
        <LogoMark className="h-[26px] w-[26px]" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[19px] font-semibold leading-none tracking-tight",
            variant === "dark" ? "text-ink-950" : "text-white",
          )}
        >
          North Specs
        </span>
        <span
          className={cn(
            "mt-1 text-[10px] font-semibold uppercase tracking-[0.28em]",
            variant === "dark" ? "text-frost-600" : "text-frost-300",
          )}
        >
          Labs
        </span>
      </span>
    </Link>
  );
}
