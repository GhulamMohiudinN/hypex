-- HypeX Supabase schema: tables, Row Level Security policies, and the product-images
-- storage bucket. Run this whole file once in Supabase Dashboard -> SQL Editor -> New query.

-- =========================================================
-- 1. PRODUCTS
-- =========================================================
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  brand text not null,
  category text not null,
  price numeric not null,
  sizes integer[] not null default '{}',
  description text,
  featured boolean not null default false,
  sold boolean not null default false,
  images text[] not null default '{}',
  dp_image text,
  created_at timestamptz not null default now()
);

alter table products enable row level security;

create policy "Products are publicly readable"
  on products for select
  using (true);

create policy "Only signed-in admins can insert products"
  on products for insert
  to authenticated
  with check (true);

create policy "Only signed-in admins can update products"
  on products for update
  to authenticated
  using (true);

create policy "Only signed-in admins can delete products"
  on products for delete
  to authenticated
  using (true);

-- =========================================================
-- 2. ORDERS
-- =========================================================
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer jsonb not null,       -- { name, phone, address, city, notes }
  items jsonb not null,          -- [{ productId, slug, name, brand, price, size, qty, image }]
  subtotal numeric not null,
  shipping numeric not null default 0,
  total numeric not null,
  payment_method text not null default 'Cash on Delivery',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table orders enable row level security;

create policy "Anyone can place an order"
  on orders for insert
  with check (true);

create policy "Only signed-in admins can view orders"
  on orders for select
  to authenticated
  using (true);

create policy "Only signed-in admins can update orders"
  on orders for update
  to authenticated
  using (true);

create policy "Only signed-in admins can delete orders"
  on orders for delete
  to authenticated
  using (true);

-- =========================================================
-- 3. REVIEWS
-- =========================================================
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  name text not null,
  rating int not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz not null default now()
);

alter table reviews enable row level security;

create policy "Reviews are publicly readable"
  on reviews for select
  using (true);

create policy "Anyone can leave a review"
  on reviews for insert
  with check (true);

create policy "Only signed-in admins can moderate reviews"
  on reviews for delete
  to authenticated
  using (true);

-- =========================================================
-- 4. CONTACT MESSAGES
-- =========================================================
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table messages enable row level security;

create policy "Anyone can send a message"
  on messages for insert
  with check (true);

create policy "Only signed-in admins can read messages"
  on messages for select
  to authenticated
  using (true);

-- =========================================================
-- 5. STORAGE: product images bucket
-- =========================================================
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

create policy "Product images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'products');

create policy "Only signed-in admins can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'products');

create policy "Only signed-in admins can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'products');

-- =========================================================
-- 6. Helpful indexes
-- =========================================================
create index if not exists idx_products_featured on products (featured);
create index if not exists idx_products_category on products (category);
create index if not exists idx_orders_created_at on orders (created_at desc);
create index if not exists idx_reviews_product_id on reviews (product_id);
