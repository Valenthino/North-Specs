import type { Category, Coa, Product, Variant } from "@/lib/catalog/types";
import type {
  CategoryRow,
  CoaDocumentRow,
  ProductRow,
  ProductVariantRow,
} from "@/lib/supabase/database.types";

type ProductWithRelations = ProductRow & {
  category?: Pick<CategoryRow, "name" | "slug"> | null;
  variants?: ProductVariantRow[] | null;
  coas?: CoaDocumentRow[] | null;
};

export function mapVariant(row: ProductVariantRow): Variant {
  return {
    id: row.id,
    name: row.name,
    sku: row.sku,
    sizeMg: row.size_mg,
    priceCents: row.price_cents,
    compareAtPriceCents: row.compare_at_price_cents,
    stockQuantity: row.stock_quantity,
    isActive: row.is_active,
  };
}

export function mapCoa(row: CoaDocumentRow): Coa {
  return {
    id: row.id,
    batchNumber: row.batch_number,
    purity: row.purity,
    testMethod: row.test_method,
    testDate: row.test_date,
    fileUrl: row.file_url,
  };
}

export function mapProduct(row: ProductWithRelations): Product {
  const variants = (row.variants ?? [])
    .map(mapVariant)
    .sort((a, b) => a.priceCents - b.priceCents);
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    subtitle: row.subtitle,
    description: row.description,
    categorySlug: row.category?.slug ?? null,
    categoryName: row.category?.name ?? null,
    casNumber: row.cas_number,
    molecularFormula: row.molecular_formula,
    molecularWeight: row.molecular_weight,
    sequence: row.sequence,
    synonyms: row.synonyms ?? [],
    purity: row.purity,
    appearance: row.appearance,
    form: row.form,
    source: row.source,
    solubility: row.solubility,
    storage: row.storage,
    reconstitution: row.reconstitution,
    researchAreas: row.research_areas ?? [],
    imageUrl: row.image_url,
    isFeatured: row.is_featured,
    researchUseOnly: row.research_use_only,
    variants,
    coas: (row.coas ?? []).map(mapCoa),
  };
}

export function mapCategory(row: CategoryRow, productCount?: number): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    shortDescription: row.short_description,
    description: row.description,
    icon: row.icon,
    displayOrder: row.display_order,
    productCount,
  };
}

export const PRODUCT_SELECT =
  "*, category:categories(name, slug), variants:product_variants(*), coas:coa_documents(*)";
