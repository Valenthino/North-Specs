"use client";

import * as React from "react";
import { FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

const STORAGE_KEY = "north-specs-research-ack-v1";

/**
 * First-visit acknowledgement gate. Visitors confirm they are a researcher /
 * research-organization representative and that all products are Research Use
 * Only. Acknowledgement is remembered in localStorage.
 */
export function ResearchGate() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setOpen(true);
    } catch {
      // storage blocked — do not block the site
    }
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const acknowledge = () => {
    try {
      localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      // ignore
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="research-gate-title"
      className="fixed inset-0 z-[100] flex items-end justify-center bg-ink-950/70 p-4 backdrop-blur-sm sm:items-center"
    >
      <div className="w-full max-w-lg animate-slide-down rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-900 text-frost-300">
            <FlaskConical className="h-6 w-6" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-frost-700">
              Research Use Only
            </p>
            <h2 id="research-gate-title" className="text-xl font-bold text-ink-950">
              Confirm research use
            </h2>
          </div>
        </div>

        <div className="space-y-3 text-sm leading-relaxed text-ink-700">
          <p>
            {siteConfig.name} supplies high-purity peptides <strong>strictly for laboratory and
            in-vitro research</strong>. Products are not drugs, supplements, cosmetics or food, and
            are <strong>not for human or veterinary use</strong>.
          </p>
          <p>By entering, you confirm that:</p>
          <ul className="list-disc space-y-1 pl-5 text-ink-600">
            <li>You are a qualified researcher or represent a research organization.</li>
            <li>You will use all products for legitimate research purposes only.</li>
            <li>You are of legal age in your province of residence.</li>
          </ul>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => window.history.back()}>
            Leave
          </Button>
          <Button variant="primary" onClick={acknowledge}>
            I confirm — enter site
          </Button>
        </div>
      </div>
    </div>
  );
}
