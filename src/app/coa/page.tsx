import type { Metadata } from "next";
import Link from "next/link";
import { FileCheck2, Microscope } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { getAllProducts } from "@/lib/data/products";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Certificates of Analysis",
  description:
    "Third-party HPLC and mass-spec certificates of analysis for North Specs research peptides.",
};

export default async function CoaPage() {
  const products = await getAllProducts();
  const withCoa = products.filter((p) => p.coas.length > 0);

  return (
    <>
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="bg-grid absolute inset-0 opacity-[0.12]" />
        <Container className="relative py-16">
          <Badge tone="frost" className="mb-4 bg-white/10 text-frost-200">
            <FileCheck2 className="h-3.5 w-3.5" /> Third-party tested
          </Badge>
          <h1 className="max-w-2xl font-display text-3xl font-bold sm:text-4xl">
            Certificates of Analysis
          </h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Purity is determined by HPLC and identity confirmed by mass spectrometry. Each batch is
            documented so you can trace exactly what you received.
          </p>
        </Container>
      </section>

      <Container className="py-12">
        {withCoa.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink-200 p-10 text-center text-ink-500">
            Batch certificates are provided with each order. Contact us to request the COA for a
            specific lot.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
            <table className="w-full text-sm">
              <thead className="bg-ink-50 text-left text-xs uppercase tracking-wider text-ink-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Product</th>
                  <th className="px-5 py-3 font-semibold">Batch</th>
                  <th className="px-5 py-3 font-semibold">Purity</th>
                  <th className="px-5 py-3 font-semibold">Method</th>
                  <th className="px-5 py-3 font-semibold">Tested</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {withCoa.flatMap((product) =>
                  product.coas.map((coa) => (
                    <tr key={coa.id} className="hover:bg-ink-50/50">
                      <td className="px-5 py-3">
                        <Link href={`/shop/${product.slug}`} className="font-semibold text-ink-950 hover:text-frost-700">
                          {product.name}
                        </Link>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-ink-700">{coa.batchNumber}</td>
                      <td className="px-5 py-3 font-semibold text-aurora-700">{coa.purity ?? "—"}</td>
                      <td className="px-5 py-3 text-ink-600">{coa.testMethod ?? "—"}</td>
                      <td className="px-5 py-3 text-ink-600">{formatDate(coa.testDate)}</td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-frost-100 bg-frost-50 p-5">
          <Microscope className="mt-0.5 h-5 w-5 flex-shrink-0 text-frost-700" />
          <p className="text-sm text-frost-900">
            Need a COA for a specific batch not listed here?{" "}
            <Link href="/contact" className="font-semibold underline">
              Contact our team
            </Link>{" "}
            and we&apos;ll provide the documentation for your lot.
          </p>
        </div>
      </Container>
    </>
  );
}
