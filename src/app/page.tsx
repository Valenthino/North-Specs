import Link from "next/link";
import {
  ArrowRight,
  FileCheck2,
  FlaskConical,
  Microscope,
  PackageCheck,
  ShieldCheck,
  Snowflake,
  Truck,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/product-card";
import { CategoryIcon } from "@/components/category-icon";
import { getFeaturedProducts } from "@/lib/data/products";
import { getCategories } from "@/lib/data/categories";
import { getArticles } from "@/lib/data/learn";
import { formatDate } from "@/lib/utils";

export default async function HomePage() {
  const [featured, categories, articles] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
    getArticles(),
  ]);

  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="bg-grid absolute inset-0 opacity-[0.15]" />
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-frost-500/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-frost-700/20 blur-3xl" />
        <Container className="relative py-20 sm:py-28 lg:py-32">
          <div className="max-w-3xl">
            <Badge tone="frost" className="mb-6 bg-white/10 text-frost-200">
              <FlaskConical className="h-3.5 w-3.5" /> Research Use Only · Made for Canadian labs
            </Badge>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              High-purity research peptides,{" "}
              <span className="text-frost-300">verified batch by batch.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
              North Specs Peptides supplies researchers and laboratories across Canada with
              third-party-tested peptides — complete with certificates of analysis, full molecular
              specifications, and reliable cold-chain shipping. Strictly for laboratory research.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className={buttonVariants({ variant: "secondary", size: "lg" })}>
                Shop peptides <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/coa"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "border-white/20 bg-white/5 text-white hover:bg-white/10",
                })}
              >
                <FileCheck2 className="h-5 w-5" /> View certificates of analysis
              </Link>
            </div>
            <p className="mt-6 text-sm text-white/50">
              Not for human or veterinary use · For in-vitro laboratory research only
            </p>
          </div>
        </Container>
      </section>

      {/* ─── Trust bar ────────────────────────────────────────── */}
      <section className="border-b border-ink-100 bg-white">
        <Container>
          <div className="grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
            {[
              { icon: Microscope, title: "≥98–99% purity", text: "HPLC & mass-spec verified" },
              { icon: FileCheck2, title: "COA on every batch", text: "Third-party tested" },
              { icon: Snowflake, title: "Cold-chain shipping", text: "Stability protected" },
              { icon: Truck, title: "Canada-wide delivery", text: "Discreet & tracked" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-frost-50 text-frost-700">
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink-950">{item.title}</p>
                  <p className="text-xs text-ink-500">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── Categories ───────────────────────────────────────── */}
      <section className="section bg-ink-50/50">
        <Container>
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow mb-2">Research categories</p>
              <h2 className="text-3xl font-bold text-ink-950">Browse by research area</h2>
            </div>
            <Link href="/shop" className="link-underline text-sm">
              View all peptides <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-ink-100 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:border-frost-200 hover:shadow-card-hover"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-950 text-frost-300 transition-colors group-hover:bg-frost-500 group-hover:text-white">
                  <CategoryIcon name={cat.icon} className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-base font-bold text-ink-950">{cat.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-ink-500">{cat.shortDescription}</p>
                <p className="mt-3 text-xs font-semibold text-frost-700">
                  {cat.productCount ?? 0} products →
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── Featured products ────────────────────────────────── */}
      <section className="section">
        <Container>
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow mb-2">Popular in research</p>
              <h2 className="text-3xl font-bold text-ink-950">Featured peptides</h2>
            </div>
            <Link href="/shop?sort=featured" className="link-underline text-sm">
              See all featured <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ProductGrid products={featured} />
        </Container>
      </section>

      {/* ─── Quality / built for researchers ──────────────────── */}
      <section className="section bg-ink-950 text-white">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow mb-3 text-frost-300">Quality you can cite</p>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Built for researchers who need reproducible results
              </h2>
              <p className="mt-5 text-lg text-white/70">
                Every North Specs peptide ships with the documentation your work depends on. We
                publish molecular specifications, purity data and batch certificates so you can trust
                what&apos;s in the vial.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  { title: "Third-party HPLC & MS testing", text: "Independent verification of identity and purity for every lot." },
                  { title: "Full molecular specifications", text: "CAS number, molecular formula, weight and sequence on every product." },
                  { title: "Certificate of Analysis access", text: "Batch-specific COAs linked directly from the product page." },
                  { title: "Cold-chain, Canada-wide", text: "Stability-protected packaging and tracked domestic delivery." },
                ].map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <ShieldCheck className="mt-0.5 h-6 w-6 flex-shrink-0 text-frost-300" />
                    <div>
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="text-sm text-white/60">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link
                href="/quality"
                className={buttonVariants({
                  variant: "outline",
                  className: "mt-8 border-white/20 bg-white/5 text-white hover:bg-white/10",
                })}
              >
                How we test <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "≥99%", label: "Typical purity" },
                { value: "100%", label: "Batches tested" },
                { value: "20+", label: "Research peptides" },
                { value: "🇨🇦", label: "Canada-wide" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center"
                >
                  <p className="font-display text-4xl font-bold text-frost-300">{stat.value}</p>
                  <p className="mt-1 text-sm text-white/60">{stat.label}</p>
                </div>
              ))}
              <div className="col-span-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6">
                <PackageCheck className="h-8 w-8 flex-shrink-0 text-frost-300" />
                <p className="text-sm text-white/70">
                  Orders are reviewed to confirm research use before dispatch.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Learn preview ────────────────────────────────────── */}
      <section className="section">
        <Container>
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow mb-2">Research resources</p>
              <h2 className="text-3xl font-bold text-ink-950">Learn &amp; handle with confidence</h2>
            </div>
            <Link href="/learn" className="link-underline text-sm">
              All resources <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {articles.slice(0, 3).map((article) => (
              <Link
                key={article.id}
                href={`/learn/${article.slug}`}
                className="group flex flex-col rounded-2xl border border-ink-100 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <Badge tone="frost" className="w-fit">
                  {article.category}
                </Badge>
                <h3 className="mt-3 text-lg font-bold text-ink-950 group-hover:text-frost-700">
                  {article.title}
                </h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm text-ink-500">{article.excerpt}</p>
                <p className="mt-4 text-xs text-ink-400">
                  {formatDate(article.publishedAt)} · {article.readingMinutes} min read
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── CTA band ─────────────────────────────────────────── */}
      <section className="border-t border-ink-100 bg-frost-50">
        <Container className="py-14">
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="max-w-2xl text-2xl font-bold text-ink-950 sm:text-3xl">
              Ready to source research-grade peptides for your lab?
            </h2>
            <p className="max-w-xl text-ink-600">
              Create a research account to access ordering, batch documentation and order history.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/shop" className={buttonVariants({ variant: "primary", size: "lg" })}>
                Browse the catalogue
              </Link>
              <Link href="/auth/register" className={buttonVariants({ variant: "outline", size: "lg" })}>
                Create a research account
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
