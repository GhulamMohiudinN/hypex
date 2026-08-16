# HYPEX

A production-ready sneaker resale eCommerce site built with Next.js (App Router, JavaScript),
Tailwind CSS, Supabase (Auth, Postgres, Storage), GSAP, Lenis smooth scroll, React Icons,
Zustand, React Hot Toast, and SweetAlert2. The admin dashboard is an installable PWA.

Palette: cream background `#F7F5EF`, ink `#111111`, accent red `#E31937` (matching the HypeX logo).
Fonts: **Anton** (display/headlines) + **Epilogue** (body).

---

## 1. Folder Structure

```
hypeX/
├── assests/                       # your raw downloaded photos/videos (not shipped to the site)
├── public/
│   ├── images/
│   │   ├── logo.jpg
│   │   └── products/p1..p35/      # organized product galleries (see scripts/organize-assets.mjs)
│   ├── videos/hero-1.mp4, hero-2.mp4, hero-3.mp4
│   ├── manifest-admin.json        # PWA manifest, admin dashboard only
│   └── admin-sw.js                # PWA service worker, admin dashboard only
├── scripts/
│   ├── organize-assets.mjs        # groups raw photos into per-product galleries (already run)
│   └── seed-supabase.mjs          # pushes the 35 catalogued products into Supabase
├── supabase/
│   └── schema.sql                 # tables + Row Level Security policies + storage bucket
├── src/
│   ├── app/
│   │   ├── layout.js, globals.css, page.js (home)
│   │   ├── shop/page.js, shop/[slug]/page.js
│   │   ├── cart/page.js, checkout/page.js
│   │   ├── about/page.js, contact/page.js
│   │   └── admin/
│   │       ├── page.js                    # admin login
│   │       └── dashboard/                 # protected, PWA-enabled
│   │           ├── page.js                # overview stats
│   │           ├── products/              # list, new, [id]/edit
│   │           └── orders/                # order management
│   ├── components/                # layout, home, shop, product, cart, admin, ui
│   ├── data/catalog-seed.js       # metadata for the 35 seed products
│   ├── lib/                       # supabaseClient, products, orders, reviews, contact, auth, format
│   ├── store/                     # useCartStore (localStorage), useAdminStore
│   └── hooks/useScrollReveal.js
└── .env.local                     # not committed — create it yourself, see below
```

---

## 2. Install & Run

```bash
npm install
```

Create a `.env.local` file in the project root (see § 3.2 below for where to get the values):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

```bash
npm run dev
```

Site runs at `http://localhost:3000`. Admin dashboard is at `http://localhost:3000/admin`.

---

## 3. Supabase Setup (do this before anything works)

### 3.1 Create the project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**.
2. Pick an organization, name it (e.g. "hypex"), set a database password (save it somewhere),
   choose a region close to Pakistan (e.g. **Singapore**), click **Create new project**.
   Wait ~2 minutes for it to finish provisioning.

### 3.2 Get your API keys

1. In the project, go to **Project Settings** (gear icon) → **API**.
2. Copy the **Project URL** and the **`anon` `public`** key into `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Restart `npm run dev` after saving `.env.local`.

### 3.3 Create the database tables + security rules

1. Left sidebar → **SQL Editor** → **New query**.
2. Open [`supabase/schema.sql`](./supabase/schema.sql) from this repo, copy its *entire*
   contents, paste into the SQL Editor, and click **Run**.
3. This one script creates everything:
   - `products`, `orders`, `reviews`, `messages` tables
   - Row Level Security policies — anyone can browse products/reviews and submit
     orders/reviews/the contact form, but only a **signed-in admin** can create/edit/delete
     products, view/update orders, or read contact messages
   - A public `products` **Storage bucket** for product photos, with matching policies
     (public read, admin-only upload/delete)

If you ever need to re-run it, it's safe — `create table if not exists` and
`on conflict do nothing` mean it won't duplicate anything that already exists.

### 3.4 Enable the admin login

1. Left sidebar → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Enter the exact email + password you want to log in with at `/admin`. Untick "Auto confirm
   user" only if you want to send a confirmation email — for a single admin account it's
   easiest to leave "Auto confirm" checked so the account is usable immediately.
3. Email/Password sign-in is enabled by default in Supabase, so no extra provider setup needed.
4. Add more admins later the same way (Authentication → Users → Add user).

### 3.5 Seed the 35 starter products (optional but recommended)

The `assests/` photos have already been organized into `public/images/products/p1..p35/` and
matched with real names/prices in `src/data/catalog-seed.js`. To push them into Supabase:

1. **Project Settings → API** → copy the **`service_role` `secret`** key (different from the
   `anon` key — this one bypasses Row Level Security, so it's only ever used locally in the
   seed script, never in the browser).
2. Add it to `.env.local`:

```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

3. Run:

```bash
npm run seed
```

This creates the 35 products in Supabase, pointing at the already-organized images in
`public/images/products/`. Safe to re-run — it skips products that already exist (matched by slug).

If you'd rather start empty and add everything yourself, just skip this step and use
**Add Product** in the admin dashboard instead.

---

## 4. Using the Admin Dashboard

- URL: `/admin`
- Log in with the email/password you created in Supabase Authentication (step 3.4).
- From the dashboard you can:
  - See store stats (products, stock, orders, revenue) on **Overview**
  - **Add Product**: upload a display picture + extra gallery photos (stored in Supabase
    Storage), set name/brand/category/price/sizes/description, mark featured
  - **Products**: search, edit, delete, or toggle **Sold Out / In Stock** with one click
  - **Orders**: see every COD order placed at checkout, expand for full item + address detail,
    and change status (pending → confirmed → shipped → delivered / cancelled)

### PWA (installable admin dashboard)

The `/admin` section ships its own manifest (`public/manifest-admin.json`) and service worker
(`public/admin-sw.js`), scoped only to `/admin/*` — the public storefront is **not** a PWA.
Open the admin dashboard in Chrome/Edge on desktop or mobile and use **"Install app" /
"Add to Home Screen"** from the browser menu (or the install icon in the address bar) to add
it as a standalone app icon.

---

## 5. Key Features

- **Home**: full-viewport 3-video hero grid with GSAP entrance + parallax (single video on
  mobile), brand marquee, featured products, category tiles, brand story, testimonials, CTA banner
- **Shop**: search + category/brand filters + sorting, GSAP stagger reveal
- **Product Detail**: DP + gallery thumbnails, size selector, add to bag, reviews (read + submit),
  related products, sold-out state disables purchase
- **Cart**: Zustand store persisted to `localStorage`, slide-out drawer + full `/cart` page
- **Checkout**: name/phone/address/city form → Supabase order, **Cash on Delivery only** (no
  payment gateway), SweetAlert2 confirmation
- **Admin**: Supabase Auth–gated dashboard, full product CRUD with multi-image Storage upload,
  sold/available toggle, order management with status updates — installable as a PWA
- **Smooth scroll**: Lenis wired into GSAP's ticker + ScrollTrigger
- **Fully responsive**: mobile, tablet, desktop

---

## 6. Build for Production

```bash
npm run build
npm run start
```

Deploy anywhere that supports Next.js (Vercel is the simplest). Remember to add the same
`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` env vars in your hosting provider's
dashboard (the `SUPABASE_SERVICE_ROLE_KEY` is only needed locally for `npm run seed` — don't add
it to your hosting provider's env vars, since it never needs to run in production).
