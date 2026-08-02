import type { Metadata } from "next";
import Link from "next/link";
import { FileCheck2, FlaskConical, Microscope, PackageCheck, Snowflake, TestTube2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { buttonVariants } from "@/components/ui/button";
import { RuoNotice } from "@/components/compliance/ruo-notice";

export const metadata: Metadata = {
  title: "Quality & Testing",
  description:
    "How North Specs verifies purity and identity: third-party HPLC and mass spectrometry, certificates of analysis, and cold-chain handling.",
};

const steps = [
  {
    icon: TestTube2,
    title: "Synthesis & sourcing",
    text: "Peptides are synthesised to research-grade standards and sourced from vetted manufacturing partners.",
  },
  {
    icon: Microscope,
    title: "HPLC purity analysis",
    text: "High-performance liquid chromatography quantifies purity, typically ≥98–99% for our catalogue.",
  },
  {
    icon: FlaskConical,
    title: "Mass-spec identity",
    text: "Mass spectrometry confirms molecular identity against the expected molecular weight.",
  },
  {
    icon: FileCheck2,
    title: "Certificate of Analysis",
    text: "Each batch is documented with a COA recording purity, method and test date.",
  },
  {
    icon: Snowflake,
    title: "Cold-chain packaging",
    text: "Products are packaged to preserve stability, with cold-chain protection where required.",
  },
  {
    icon: PackageCheck,
    title: "Order review",
    text: "Orders are reviewed to confirm research use before dispatch across Canada.",
  },
];

export default function QualityPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="bg-grid absolute inset-0 opacity-[0.12]" />
        <Container className="relative py-20">
          <p className="eyebrow mb-3 text-frost-300">Quality &amp; testing</p>
          <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">
            Verified purity you can cite — batch by batch
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/70">
            Reproducible research starts with knowing exactly what&apos;s in the vial. Here&apos;s how
            every North Specs peptide is tested, documented and handled.
          </p>
        </Container>
      </section>

      <section className="section">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.title} className="relative rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
                <span className="absolute right-5 top-5 font-display text-3xl font-bold text-ink-100">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-frost-50 text-frost-700">
                  <step.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-ink-950">{step.title}</h3>
                <p className="mt-2 text-sm text-ink-600">{step.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="section bg-ink-50/50">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-ink-950">Reading a Certificate of Analysis</h2>
              <p className="mt-4 text-ink-600">
                A COA ties a specific production lot to its measured identity and purity. On every
                North Specs product page you&apos;ll find the batch, purity, test method and test date.
              </p>
              <ul className="mt-6 space-y-3 text-ink-700">
                <li><strong>Purity (HPLC):</strong> percentage of the target peptide.</li>
                <li><strong>Identity (MS):</strong> confirmation of molecular weight.</li>
                <li><strong>Batch number:</strong> traceability to a production lot.</li>
                <li><strong>Test date:</strong> when the analysis was performed.</li>
              </ul>
              <Link
                href="/learn/reading-a-certificate-of-analysis"
                className={buttonVariants({ variant: "outline", className: "mt-6" })}
              >
                Read the COA guide
              </Link>
            </div>
            <RuoNotice />
          </div>
        </Container>
      </section>
    </>
  );
}
