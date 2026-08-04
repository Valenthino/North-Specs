/**
 * Database types for the North Specs Labs schema.
 *
 * Hand-authored to match `supabase/migrations/*`. Once your project is linked
 * you can regenerate these with:
 *   supabase gen types typescript --project-id <ref> --schema public
 *
 * NOTE: these are `type` aliases (not interfaces) on purpose — object type
 * literals get an implicit index signature, which is required for the
 * supabase-js `GenericSchema` constraint. Interfaces would resolve to `never`.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = "customer" | "staff" | "admin";
export type AccountType = "academic" | "commercial" | "government" | "individual";
export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";
export type OrderStatus =
  | "pending"
  | "awaiting_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

type Timestamped = {
  created_at: string;
  updated_at: string;
};

export type CategoryRow = Timestamped & {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  image_url: string | null;
  icon: string | null;
  display_order: number;
  is_active: boolean;
};

export type ProductRow = Timestamped & {
  id: string;
  name: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  category_id: string | null;
  cas_number: string | null;
  molecular_formula: string | null;
  molecular_weight: number | null;
  sequence: string | null;
  synonyms: string[];
  purity: string | null;
  appearance: string | null;
  form: string | null;
  source: string | null;
  solubility: string | null;
  storage: string | null;
  reconstitution: string | null;
  research_areas: string[];
  image_url: string | null;
  gallery_urls: string[];
  coa_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  research_use_only: boolean;
  meta_title: string | null;
  meta_description: string | null;
};

export type ProductVariantRow = Timestamped & {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  size_mg: number | null;
  price_cents: number;
  compare_at_price_cents: number | null;
  stock_quantity: number;
  allow_backorder: boolean;
  is_active: boolean;
  display_order: number;
};

export type CoaDocumentRow = {
  id: string;
  product_id: string;
  variant_id: string | null;
  batch_number: string;
  purity: string | null;
  test_method: string | null;
  test_date: string | null;
  file_url: string | null;
  is_active: boolean;
  created_at: string;
};

export type ProfileRow = Timestamped & {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  account_type: AccountType | null;
  organization_name: string | null;
  department: string | null;
  job_title: string | null;
  phone: string | null;
  verification_status: VerificationStatus;
  accepted_terms_at: string | null;
  marketing_opt_in: boolean;
};

export type AddressRow = Timestamped & {
  id: string;
  user_id: string;
  label: string | null;
  recipient_name: string;
  organization: string | null;
  line1: string;
  line2: string | null;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default: boolean;
};

export type OrderRow = Timestamped & {
  id: string;
  order_number: string;
  user_id: string | null;
  email: string;
  status: OrderStatus;
  subtotal_cents: number;
  shipping_cents: number;
  tax_cents: number;
  discount_cents: number;
  total_cents: number;
  currency: string;
  shipping_address: Json | null;
  billing_address: Json | null;
  po_number: string | null;
  customer_notes: string | null;
  internal_notes: string | null;
  payment_status: string;
  payment_provider: string | null;
  payment_intent_id: string | null;
  placed_at: string | null;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  variant_name: string | null;
  sku: string | null;
  unit_price_cents: number;
  quantity: number;
  total_cents: number;
  created_at: string;
};

export type LearnArticleRow = Timestamped & {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  category: string | null;
  reading_minutes: number | null;
  cover_image_url: string | null;
  author: string | null;
  is_published: boolean;
  published_at: string | null;
};

export type ContactMessageRow = {
  id: string;
  name: string | null;
  email: string;
  organization: string | null;
  subject: string | null;
  message: string;
  handled: boolean;
  created_at: string;
};

/** Keys whose type admits null — optional on insert (DB stores null/default). */
type NullableKeys<T> = { [K in keyof T]-?: null extends T[K] ? K : never }[keyof T];

type TableShape<Row, InsertOmit extends keyof Row = never> = {
  Row: Row;
  Insert: Omit<Row, InsertOmit | NullableKeys<Row>> &
    Partial<Pick<Row, (InsertOmit & keyof Row) | NullableKeys<Row>>>;
  Update: Partial<Row>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      // Insert-optional keys include DB-generated columns and non-null columns
      // that carry a database default.
      categories: TableShape<
        CategoryRow,
        "id" | "created_at" | "updated_at" | "is_active" | "display_order"
      >;
      products: TableShape<
        ProductRow,
        | "id"
        | "created_at"
        | "updated_at"
        | "synonyms"
        | "gallery_urls"
        | "research_use_only"
        | "source"
        | "is_active"
        | "is_featured"
      >;
      product_variants: TableShape<
        ProductVariantRow,
        | "id"
        | "created_at"
        | "updated_at"
        | "allow_backorder"
        | "display_order"
        | "is_active"
        | "stock_quantity"
      >;
      coa_documents: TableShape<CoaDocumentRow, "id" | "created_at" | "is_active">;
      profiles: TableShape<
        ProfileRow,
        "created_at" | "updated_at" | "role" | "verification_status" | "marketing_opt_in"
      >;
      addresses: TableShape<AddressRow, "id" | "created_at" | "updated_at" | "country" | "is_default">;
      orders: TableShape<
        OrderRow,
        | "id"
        | "order_number"
        | "created_at"
        | "updated_at"
        | "status"
        | "currency"
        | "payment_status"
        | "subtotal_cents"
        | "shipping_cents"
        | "tax_cents"
        | "discount_cents"
        | "total_cents"
      >;
      order_items: TableShape<OrderItemRow, "id" | "created_at">;
      learn_articles: TableShape<
        LearnArticleRow,
        "id" | "created_at" | "updated_at" | "reading_minutes" | "author" | "is_published" | "published_at"
      >;
      contact_messages: TableShape<ContactMessageRow, "id" | "created_at" | "handled">;
    };
    Views: Record<string, never>;
    Functions: {
      is_staff: { Args: Record<string, never>; Returns: boolean };
      is_admin: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: {
      user_role: UserRole;
      account_type: AccountType;
      verification_status: VerificationStatus;
      order_status: OrderStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
