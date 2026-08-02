import {
  Activity,
  Atom,
  Brain,
  HeartPulse,
  Infinity as InfinityIcon,
  TrendingUp,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  activity: Activity,
  "trending-up": TrendingUp,
  "heart-pulse": HeartPulse,
  infinity: InfinityIcon,
  brain: Brain,
  atom: Atom,
};

export function CategoryIcon({
  name,
  className,
}: {
  name?: string | null;
  className?: string;
}) {
  const Icon = (name && map[name]) || FlaskConical;
  return <Icon className={className} />;
}
