import { abbreviate, cn } from "@/lib/utils";

/**
 * Generated, on-brand product artwork. Renders a molecular-lattice motif over a
 * category-themed gradient with the peptide abbreviation + molecular formula.
 * Used when a product has no uploaded image, so the catalogue always looks
 * polished offline. If `imageUrl` is present it's rendered instead.
 */

const themes: Record<string, { from: string; to: string; accent: string }> = {
  "metabolic-research": { from: "#0f2749", to: "#106f85", accent: "#67e3ee" },
  "growth-hormone-secretagogues": { from: "#0a1b34", to: "#224d93", accent: "#83abda" },
  "tissue-repair-recovery": { from: "#08313f", to: "#0a8ba4", accent: "#a4f1f6" },
  "longevity-cellular-health": { from: "#0c562d", to: "#106f85", accent: "#7cf7ab" },
  "neuro-cognitive": { from: "#1b3763", to: "#08adc3", accent: "#cff9fb" },
  "bioregulation-signalling": { from: "#0f2749", to: "#165a6d", accent: "#22ccdd" },
  default: { from: "#0f2749", to: "#106f85", accent: "#67e3ee" },
};

function Hexlattice({ accent }: { accent: string }) {
  // A light hex/molecule lattice motif.
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
      className="absolute inset-0 h-full w-full opacity-[0.35]"
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
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.4 : 1.6} fill={accent} />
      ))}
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

  return (
    <div
      className={cn("relative flex h-full w-full items-center justify-center overflow-hidden", className)}
      style={{ background: `linear-gradient(135deg, ${theme.from}, ${theme.to})` }}
    >
      <Hexlattice accent={theme.accent} />
      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        <span
          className={cn(
            "font-display font-bold leading-none text-white drop-shadow-sm",
            compact ? "text-3xl" : "text-5xl",
          )}
        >
          {abbreviate(name)}
        </span>
        {molecularFormula && !compact && (
          <span className="mt-3 font-mono text-xs tracking-wide text-white/80">
            {molecularFormula}
          </span>
        )}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent" />
    </div>
  );
}
