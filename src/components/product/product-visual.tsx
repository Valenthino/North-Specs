import { abbreviate, cn } from "@/lib/utils";

/**
 * Generated, on-brand product artwork. Renders a stylised research vial filled
 * with a category-themed tint, over a soft molecular-lattice backdrop, labelled
 * with the peptide abbreviation + molecular formula. Used when a product has no
 * uploaded image, so the catalogue always looks polished offline. If `imageUrl`
 * is present it's rendered instead.
 */

const themes: Record<string, { tint: string; deep: string; bg: string }> = {
  "metabolic-research": { tint: "#4ade80", deep: "#15803d", bg: "#f0fdf4" },
  "growth-hormone-secretagogues": { tint: "#34d399", deep: "#047857", bg: "#ecfdf5" },
  "tissue-repair-recovery": { tint: "#22c55e", deep: "#166534", bg: "#f0fdf4" },
  "longevity-cellular-health": { tint: "#86efac", deep: "#16a34a", bg: "#f7fef9" },
  "neuro-cognitive": { tint: "#6ee7b7", deep: "#059669", bg: "#ecfdf5" },
  "bioregulation-signalling": { tint: "#4ade80", deep: "#14532d", bg: "#f0fdf4" },
  default: { tint: "#4ade80", deep: "#15803d", bg: "#f0fdf4" },
};

function Hexlattice({ accent }: { accent: string }) {
  const nodes = [
    [20, 30],
    [50, 18],
    [80, 34],
    [35, 58],
    [66, 62],
    [50, 86],
    [88, 74],
    [14, 74],
  ];
  const edges: [number, number][] = [
    [0, 1],
    [1, 2],
    [0, 3],
    [1, 3],
    [1, 4],
    [2, 4],
    [3, 4],
    [3, 5],
    [4, 5],
    [4, 6],
    [3, 7],
    [5, 7],
  ];
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full opacity-[0.18]"
      aria-hidden
    >
      {edges.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a][0]}
          y1={nodes[a][1]}
          x2={nodes[b][0]}
          y2={nodes[b][1]}
          stroke={accent}
          strokeWidth="0.6"
        />
      ))}
      {nodes.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.2 : 1.4} fill={accent} />
      ))}
    </svg>
  );
}

function Vial({ tint, deep, label }: { tint: string; deep: string; label: string }) {
  return (
    <svg viewBox="0 0 80 120" className="relative z-10 h-[74%] w-auto drop-shadow-sm" aria-hidden>
      <defs>
        <linearGradient id={`liq-${label}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tint} />
          <stop offset="100%" stopColor={deep} />
        </linearGradient>
        <linearGradient id={`glass-${label}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      {/* cap */}
      <rect x="26" y="4" width="28" height="12" rx="2.5" fill={deep} />
      <rect x="29" y="14" width="22" height="6" rx="1.5" fill="#9ca3af" />
      {/* glass body */}
      <rect x="24" y="20" width="32" height="94" rx="9" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1.5" />
      {/* liquid */}
      <path d="M26 62 h28 v43 a7 7 0 0 1 -7 7 h-14 a7 7 0 0 1 -7 -7 z" fill={`url(#liq-${label})`} />
      <ellipse cx="40" cy="62" rx="14" ry="3.4" fill={tint} opacity="0.65" />
      {/* glass highlight */}
      <rect x="24" y="20" width="32" height="94" rx="9" fill={`url(#glass-${label})`} opacity="0.5" />
      {/* label band */}
      <rect x="22" y="74" width="36" height="26" rx="2" fill="#ffffff" opacity="0.94" />
      <line x1="26" y1="80" x2="54" y2="80" stroke={deep} strokeWidth="1" opacity="0.35" />
      <text
        x="40"
        y="92"
        textAnchor="middle"
        fontSize="9"
        fontWeight="700"
        fontFamily="var(--font-display), sans-serif"
        fill={deep}
      >
        {label}
      </text>
    </svg>
  );
}

export function ProductVisual({
  name,
  molecularFormula,
  categorySlug,
  imageUrl,
  className,
  compact = false,
}: {
  name: string;
  molecularFormula?: string | null;
  categorySlug?: string | null;
  imageUrl?: string | null;
  className?: string;
  compact?: boolean;
}) {
  if (imageUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={imageUrl}
        alt={name}
        className={cn("h-full w-full object-cover", className)}
        loading="lazy"
      />
    );
  }

  const theme = themes[categorySlug ?? "default"] ?? themes.default;
  const label = abbreviate(name);

  return (
    <div
      className={cn("relative flex h-full w-full items-center justify-center overflow-hidden", className)}
      style={{ background: `radial-gradient(120% 100% at 50% 0%, #ffffff 0%, ${theme.bg} 100%)` }}
    >
      <Hexlattice accent={theme.deep} />
      <Vial tint={theme.tint} deep={theme.deep} label={label} />
      {molecularFormula && !compact && (
        <span className="absolute bottom-3 left-0 right-0 text-center font-mono text-[11px] tracking-wide text-ink-500">
          {molecularFormula}
        </span>
      )}
    </div>
  );
}
