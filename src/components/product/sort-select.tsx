"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select } from "@/components/ui/field";

const options = [
  { value: "name", label: "Alphabetical (A–Z)" },
  { value: "featured", label: "Featured first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

export function SortSelect({ current }: { current?: string }) {
  const router = useRouter();
  const params = useSearchParams();

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = new URLSearchParams(params.toString());
    next.set("sort", e.target.value);
    router.push(`/shop?${next.toString()}`);
  };

  return (
    <label className="flex items-center gap-2 text-sm text-ink-600">
      <span className="hidden sm:inline">Sort</span>
      <Select value={current ?? "name"} onChange={onChange} className="h-9 py-1.5 text-sm">
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
    </label>
  );
}
