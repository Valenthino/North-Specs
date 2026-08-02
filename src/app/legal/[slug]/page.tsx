import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Markdown } from "@/components/markdown";
import { legalDocs, legalSlugs } from "@/lib/legal";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return legalSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = legalDocs[slug];
  return { title: doc?.title ?? "Legal" };
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = legalDocs[slug];
  if (!doc) notFound();

  return (
    <Container className="py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-ink-950 sm:text-4xl">{doc.title}</h1>
        <p className="mt-2 text-sm text-ink-500">Last updated {formatDate(doc.updated)}</p>
        <div className="mt-8">
          <Markdown content={doc.content} />
        </div>
      </div>
    </Container>
  );
}
