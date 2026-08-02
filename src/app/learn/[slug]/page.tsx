import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Markdown } from "@/components/markdown";
import { RuoNotice } from "@/components/compliance/ruo-notice";
import { getArticleBySlug, getArticles } from "@/lib/data/learn";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article not found" };
  return { title: article.title, description: article.excerpt };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = (await getArticles()).filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <Container className="py-12">
      <div className="mx-auto max-w-3xl">
        <Link href="/learn" className="inline-flex items-center gap-1.5 text-sm font-semibold text-frost-700 hover:underline">
          <ArrowLeft className="h-4 w-4" /> All resources
        </Link>

        <div className="mt-6">
          <Badge tone="frost">{article.category}</Badge>
          <h1 className="mt-3 font-display text-3xl font-bold text-ink-950 sm:text-4xl">
            {article.title}
          </h1>
          <div className="mt-3 flex items-center gap-3 text-sm text-ink-500">
            <span>{article.author}</span>
            <span>·</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {article.readingMinutes} min
            </span>
          </div>
        </div>

        <article className="mt-8">
          <Markdown content={article.content} />
        </article>

        <div className="mt-10">
          <RuoNotice compact />
        </div>
      </div>

      {related.length > 0 && (
        <div className="mx-auto mt-16 max-w-3xl border-t border-ink-100 pt-10">
          <h2 className="mb-5 text-lg font-bold text-ink-950">More research resources</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {related.map((a) => (
              <Link
                key={a.id}
                href={`/learn/${a.slug}`}
                className="group rounded-xl border border-ink-100 bg-white p-4 shadow-card transition-all hover:shadow-card-hover"
              >
                <p className="text-xs font-semibold text-frost-700">{a.category}</p>
                <p className="mt-1 text-sm font-semibold text-ink-950 group-hover:text-frost-700">
                  {a.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
