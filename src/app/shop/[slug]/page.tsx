import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, FileCheck2, FlaskConical, Microscope, Snowflake } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { ProductVisual } from "@/components/product/product-visual";
import { ProductCard } from "@/components/product/product-card";
import { AddToCart } from "@/components/product/add-to-cart";
import { RuoNotice } from "@/components/compliance/ruo-notice";
import { getProductBySlug, getProductsByCategory } from "@/lib/data/products";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.name}${product.subtitle ? ` — ${product.subtitle}` : ""}`,
    description: `${product.name}: ${product.description ?? "Research-grade peptide."} Research Use Only.`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = product.categorySlug
    ? (await getProductsByCategory(product.categorySlug)).filter((p) => p.slug !== product.slug).slice(0, 4)
    : [];

  const specs: { label: string; value?: string | number | null; mono?: boolean }[] = [
    { label: "CAS Number", value: product.casNumber, mono: true },
    { label: "Molecular Formula", value: product.molecularFormula, mono: true },
    { label: "Molecular Weight", value: product.molecularWeight ? `${product.molecularWeight} g/mol` : null },
    { label: "Sequence", value: product.sequence, mono: true },
    { label: "Purity", value: product.purity },
    { label: "Appearance", value: product.appearance },
    { label: "Form", value: product.form },
    { label: "Source", value: product.source },
    { label: "Solubility", value: product.solubility },
    { label: "Storage", value: product.storage },
    { label: "Reconstitution", value: product.reconstitution },
  ];
  const shownSpecs = specs.filter((s) => s.value);

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-ink-100 bg-white">
        <Container className="flex items-center gap-1.5 py-3 text-xs text-ink-500">
          <Link href="/" className="hover:text-frost-700">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/shop" className="hover:text-frost-700">Shop</Link>
          {product.categorySlug && (
            <>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link href={`/categories/${product.categorySlug}`} className="hover:text-frost-700">
                {product.categoryName}
              </Link>
            </>
          )}
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="truncate font-medium text-ink-800">{product.name}</span>
        </Container>
      </div>

      <Container className="py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Visual */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="aspect-square overflow-hidden rounded-3xl border border-ink-100 shadow-card">
              <ProductVisual
                name={product.name}
                molecularFormula={product.molecularFormula}
                categorySlug={product.categorySlug}
                imageUrl={product.imageUrl}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { icon: Microscope, label: product.purity ?? "High purity" },
                { icon: FileCheck2, label: product.coas.length ? "COA available" : "Batch tested" },
                { icon: Snowflake, label: "Cold-chain" },
              ].map((b) => (
                <div
                  key={b.label}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-ink-100 bg-white p-3 text-center"
                >
                  <b.icon className="h-5 w-5 text-frost-600" />
                  <span className="text-[11px] font-medium text-ink-600">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detail */}
          <div>
            {product.categoryName && (
              <Link
                href={`/categories/${product.categorySlug}`}
                className="text-xs font-semibold uppercase tracking-wider text-frost-700 hover:underline"
              >
                {product.categoryName}
              </Link>
            )}
            <h1 className="mt-1 font-display text-3xl font-bold text-ink-950 sm:text-4xl">
              {product.name}
            </h1>
            {product.subtitle && <p className="mt-2 text-lg text-ink-500">{product.subtitle}</p>}

            <div className="mt-4 flex flex-wrap gap-2">
              {product.purity && <Badge tone="ink">{product.purity} purity</Badge>}
              {product.coas.length > 0 && (
                <Badge tone="frost">
                  <FileCheck2 className="h-3 w-3" /> COA on file
                </Badge>
              )}
              <Badge tone="amber">
                <FlaskConical className="h-3 w-3" /> Research Use Only
              </Badge>
            </div>

            {product.description && (
              <p className="mt-6 leading-relaxed text-ink-700">{product.description}</p>
            )}

            <div className="mt-8 rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
              <AddToCart product={product} />
            </div>

            <div className="mt-6">
              <RuoNotice />
            </div>

            {product.researchAreas.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-sm font-semibold text-ink-800">Research areas</p>
                <div className="flex flex-wrap gap-2">
                  {product.researchAreas.map((area) => (
                    <Badge key={area} tone="outline">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Specifications */}
        <section className="mt-16 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold text-ink-950">Specifications</h2>
            <dl className="mt-4 divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100">
              {shownSpecs.map((spec) => (
                <div key={spec.label} className="grid grid-cols-3 gap-4 px-5 py-3.5 odd:bg-ink-50/40">
                  <dt className="text-sm font-medium text-ink-500">{spec.label}</dt>
                  <dd
                    className={`col-span-2 text-sm text-ink-900 ${spec.mono ? "font-mono break-words" : ""}`}
                  >
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* COA */}
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold text-ink-950">
              <FileCheck2 className="h-5 w-5 text-frost-600" /> Certificates of Analysis
            </h2>
            {product.coas.length > 0 ? (
              <div className="mt-4 overflow-hidden rounded-2xl border border-ink-100">
                <table className="w-full text-sm">
                  <thead className="bg-ink-50 text-left text-xs uppercase tracking-wider text-ink-500">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Batch</th>
                      <th className="px-5 py-3 font-semibold">Purity</th>
                      <th className="px-5 py-3 font-semibold">Method</th>
                      <th className="px-5 py-3 font-semibold">Tested</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-100">
                    {product.coas.map((coa) => (
                      <tr key={coa.id}>
                        <td className="px-5 py-3 font-mono text-xs text-ink-900">{coa.batchNumber}</td>
                        <td className="px-5 py-3 font-semibold text-aurora-700">{coa.purity ?? "—"}</td>
                        <td className="px-5 py-3 text-ink-600">{coa.testMethod ?? "—"}</td>
                        <td className="px-5 py-3 text-ink-600">{formatDate(coa.testDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-4 rounded-2xl border border-dashed border-ink-200 p-6 text-sm text-ink-500">
                Batch-specific certificates of analysis are provided with each order. Contact us to
                request the COA for a specific lot.
              </p>
            )}
            <p className="mt-3 text-xs text-ink-400">
              Purity determined by HPLC; identity confirmed by mass spectrometry.
            </p>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-6 text-xl font-bold text-ink-950">Related peptides</h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
