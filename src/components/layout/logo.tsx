import Link from "next/link";
import { cn } from "@/lib/utils";

/** North Specs mark: a compass/north-star node inside a molecular hexagon. */
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
        d="M20 2.5 L34.5 11 V29 L20 37.5 L5.5 29 V11 Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        className="text-frost-400"
      />
      <path
        d="M20 9 L23 19 L33 20 L23 21 L20 31 L17 21 L7 20 L17 19 Z"
        fill="currentColor"
        className="text-frost-400"
      />
      <circle cx="20" cy="20" r="2.6" fill="currentColor" className="text-white" />
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
      aria-label="North Specs Peptides — home"
    >
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
          variant === "dark" ? "bg-ink-950" : "bg-white/10",
        )}
      >
        <LogoMark />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-lg font-bold tracking-tight",
            variant === "dark" ? "text-ink-950" : "text-white",
          )}
        >
          North Specs
        </span>
        <span
          className={cn(
            "text-[10px] font-semibold uppercase tracking-[0.22em]",
            variant === "dark" ? "text-frost-600" : "text-frost-300",
          )}
        >
          Peptides
        </span>
      </span>
    </Link>
  );
}
