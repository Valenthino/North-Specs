import Link from "next/link";
import { FlaskConical, ShieldCheck } from "lucide-react";
import { LogoMark } from "@/components/layout/logo";
import { siteConfig } from "@/config/site";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="grid min-h-[calc(100vh-8rem)] lg:grid-cols-2">
      {/* Form side */}
      <div className="flex items-center justify-center px-5 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-ink-950 sm:text-3xl">{title}</h1>
          <p className="mt-2 text-ink-500">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-6 text-sm text-ink-600">{footer}</div>
        </div>
      </div>

      {/* Brand side */}
      <div className="relative hidden overflow-hidden bg-ink-950 lg:block">
        <div className="bg-grid absolute inset-0 opacity-[0.12]" />
        <div className="absolute -right-20 top-20 h-80 w-80 rounded-full bg-frost-500/20 blur-3xl" />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <LogoMark />
            </span>
            <span className="font-display text-lg font-bold">North Specs Labs</span>
          </div>
          <div>
            <FlaskConical className="h-10 w-10 text-frost-300" />
            <p className="mt-6 max-w-md text-2xl font-semibold leading-snug">
              Research-grade peptides, verified batch by batch — built for Canadian labs.
            </p>
            <ul className="mt-8 space-y-3 text-white/70">
              {[
                "Third-party HPLC & MS tested",
                "Certificates of analysis on file",
                "Order history & reordering",
                "Institutional purchase orders",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <ShieldCheck className="h-5 w-5 text-frost-300" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-white/40">
            <Link href="/" className="hover:text-frost-300">
              ← Back to store
            </Link>{" "}
            · {siteConfig.compliance.ruoShort}
          </p>
        </div>
      </div>
    </div>
  );
}
