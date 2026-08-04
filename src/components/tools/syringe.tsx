"use client";

import { cn } from "@/lib/utils";

// Barrel geometry in viewBox user units.
const TOP = 74; // barrel top (needle end) — the 0 graduation
const BOTTOM = 386; // barrel bottom (flange end) — the max graduation
const HEIGHT = BOTTOM - TOP;
const LEFT = 56;
const RIGHT = 108;
const FLANGE_Y = 424;

/**
 * Live insulin-syringe illustration. The liquid column, plunger seal and fill
 * marker all animate to the computed unit value, and the graduation scale
 * re-labels itself for the selected syringe size.
 *
 * Everything that moves is driven by a CSS transform (not an SVG geometry
 * attribute) so the transition actually animates.
 */
export function Syringe({
  units,
  maxUnits,
  className,
}: {
  units: number;
  maxUnits: number;
  className?: string;
}) {
  const overfilled = units > maxUnits;
  const clamped = Math.max(0, Math.min(units, maxUnits));
  const fraction = maxUnits > 0 ? clamped / maxUnits : 0;
  const fillY = TOP + fraction * HEIGHT;

  // Graduations: six labelled majors, minor ticks every 1/20 of the barrel.
  const majors = Array.from({ length: 6 }, (_, i) => (i * maxUnits) / 5);
  const minors = Array.from({ length: 21 }, (_, i) => (i * maxUnits) / 20);

  const unitLabel = Number.isInteger(clamped)
    ? String(clamped)
    : clamped.toFixed(clamped < 10 ? 2 : 1);

  const glide = "transition-transform duration-500 ease-out motion-reduce:transition-none";

  return (
    <svg
      viewBox="0 0 200 450"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label={`Syringe drawn to ${unitLabel} of ${maxUnits} units`}
    >
      <defs>
        <linearGradient id="ns-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#f6f8f5" />
          <stop offset="100%" stopColor="#e3e9e1" />
        </linearGradient>
        <linearGradient id="ns-liquid" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#51a578" />
          <stop offset="45%" stopColor="#2f8859" />
          <stop offset="100%" stopColor="#1b573a" />
        </linearGradient>
        <linearGradient id="ns-plunger" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b4c4b0" />
          <stop offset="50%" stopColor="#688063" />
          <stop offset="100%" stopColor="#42523f" />
        </linearGradient>
        <clipPath id="ns-barrel-clip">
          <rect x={LEFT} y={TOP} width={RIGHT - LEFT} height={HEIGHT} rx="4" />
        </clipPath>
      </defs>

      {/* ── Needle & hub ─────────────────────────────────── */}
      <line x1="82" y1="8" x2="82" y2="46" stroke="#8aa285" strokeWidth="3" strokeLinecap="round" />
      <line x1="82" y1="8" x2="82" y2="19" stroke="#42523f" strokeWidth="3" strokeLinecap="round" />
      <path d="M71 46 H93 L88 74 H76 Z" fill="#d6dfd3" stroke="#b4c4b0" strokeWidth="1.5" />

      {/* ── Barrel body ──────────────────────────────────── */}
      <rect x={LEFT} y={TOP} width={RIGHT - LEFT} height={HEIGHT} rx="4" fill="url(#ns-glass)" />

      {/* Plunger rod — fixed; the liquid column paints over the part above the
          seal, so it always reads as sitting below the plunger. */}
      <rect x={76} y={TOP + 12} width={12} height={FLANGE_Y - TOP - 12} fill="#c8d3c5" />
      <rect x={81} y={TOP + 12} width={3} height={FLANGE_Y - TOP - 12} fill="#ffffff" opacity="0.6" />

      {/* Liquid column — scaled from the needle end so it animates smoothly. */}
      <g clipPath="url(#ns-barrel-clip)">
        <rect
          x={LEFT}
          y={TOP}
          width={RIGHT - LEFT}
          height={HEIGHT}
          fill="url(#ns-liquid)"
          className={glide}
          style={{ transformOrigin: `0px ${TOP}px`, transform: `scaleY(${fraction})` }}
        />
        {fraction > 0 && (
          <rect
            x={LEFT}
            y={TOP - 3}
            width={RIGHT - LEFT}
            height={3}
            fill="#ffffff"
            opacity="0.45"
            className={glide}
            style={{ transform: `translateY(${fillY - TOP}px)` }}
          />
        )}
        <rect x={LEFT + 6} y={TOP} width={5} height={HEIGHT} fill="#ffffff" opacity="0.35" />
      </g>

      {/* Barrel outline drawn over the fill so the glass edge stays crisp. */}
      <rect
        x={LEFT}
        y={TOP}
        width={RIGHT - LEFT}
        height={HEIGHT}
        rx="4"
        fill="none"
        stroke="#a7b8a3"
        strokeWidth="1.6"
      />

      {/* ── Graduations ──────────────────────────────────── */}
      {minors.map((value, i) => {
        const y = TOP + (value / maxUnits) * HEIGHT;
        const isMajor = i % 4 === 0;
        return (
          <line
            key={`tick-${i}`}
            x1={RIGHT - (isMajor ? 17 : 9)}
            y1={y}
            x2={RIGHT}
            y2={y}
            stroke="#2d372c"
            strokeOpacity={isMajor ? 0.6 : 0.3}
            strokeWidth={isMajor ? 1.4 : 1}
          />
        );
      })}
      {majors.map((value, i) => (
        <text
          key={`label-${i}`}
          x={RIGHT + 8}
          y={TOP + (value / maxUnits) * HEIGHT + 4}
          fontSize="11"
          fill="#52664e"
          fontWeight="600"
        >
          {Number.isInteger(value) ? value : value.toFixed(1)}
        </text>
      ))}

      {/* ── Plunger seal ─────────────────────────────────── */}
      <g className={glide} style={{ transform: `translateY(${fillY - TOP}px)` }}>
        <rect x={LEFT} y={TOP} width={RIGHT - LEFT} height="15" rx="2.5" fill="url(#ns-plunger)" />
        <rect x={LEFT} y={TOP + 15} width={RIGHT - LEFT} height="4" fill="#42523f" opacity="0.45" />
      </g>

      {/* Thumb flange */}
      <rect x="50" y={FLANGE_Y} width="64" height="12" rx="6" fill="#8aa285" />

      {/* ── Fill marker ──────────────────────────────────── */}
      <g className={glide} style={{ transform: `translateY(${fillY}px)` }}>
        <line
          x1={LEFT - 32}
          y1="0"
          x2={LEFT}
          y2="0"
          stroke="#b3936c"
          strokeWidth="1.6"
          strokeDasharray="3 3"
        />
        <rect x={LEFT - 50} y="-12" width="46" height="24" rx="6" fill="#b3936c" />
        <text x={LEFT - 27} y="4.5" fontSize="12" fontWeight="700" fill="#ffffff" textAnchor="middle">
          {unitLabel}
        </text>
      </g>

      {overfilled && (
        <text x="100" y="446" fontSize="11" fontWeight="700" fill="#b91c1c" textAnchor="middle">
          Exceeds syringe capacity
        </text>
      )}
    </svg>
  );
}
