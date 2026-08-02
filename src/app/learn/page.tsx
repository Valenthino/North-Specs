import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { getArticles } from "@/lib/data/learn";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Learn — Research Resources",
  description:
    "Guides on reconstitution, storage, certificates of analysis and Research Use Only compliance for Canadian labs.",
};

export default async function LearnPage() {
  const articles = await getArticles();

  return (
    <>
      <section className="relative overflow-hidden bg-ink-950 text-white">
        <div className="bg-grid absolute inset-0 opacity-[0.12]" />
        <Container className="relative py-16">
          <Badge tone="frost" className="mb-4 bg-white/10 text-frost-200">
            <BookOpen className="h-3.5 w-3.5" /> Research resources
          </Badge>
          <h1 className="max-w-2xl font-display text-3xl font-bold sm:text-4xl">
            Handle, store and document research peptides with confidence
          </h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Practical guidance written for researchers — reconstitution, cold-chain storage, reading
            a certificate of analysis, and Research Use Only compliance in Canada.
          </p>
        </Container>
      </section>

      <Container className="py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/learn/${article.slug}`}
              className="group flex flex-col rounded-2xl border border-ink-100 bg-white p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <Badge tone="frost" className="w-fit">
                {article.category}
              </Badge>
              <h2 className="mt-3 text-lg font-bold text-ink-950 group-hover:text-frost-700">
                {article.title}
              </h2>
              <p className="mt-2 line-clamp-3 flex-1 text-sm text-ink-500">{article.excerpt}</p>
              <p className="mt-4 text-xs text-ink-400">
                {formatDate(article.publishedAt)} · {article.readingMinutes} min read
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
