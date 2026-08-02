import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { demoArticles, type Article } from "@/lib/catalog/learn";

function mapArticle(row: {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  reading_minutes: number | null;
  author: string | null;
  published_at: string | null;
}): Article {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt ?? "",
    content: row.content ?? "",
    category: row.category ?? "General",
    readingMinutes: row.reading_minutes ?? 5,
    author: row.author ?? "North Specs Scientific Team",
    publishedAt: row.published_at ?? new Date().toISOString(),
  };
}

export const getArticles = cache(async (): Promise<Article[]> => {
  const supabase = await createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from("learn_articles")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    if (!error && data && data.length > 0) {
      return data.map(mapArticle);
    }
  }
  return demoArticles;
});

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getArticles();
  return articles.find((a) => a.slug === slug) ?? null;
}
