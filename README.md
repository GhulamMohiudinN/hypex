# SNEAKER SUPPLY

A production-ready sneaker resale eCommerce site built with Next.js (App Router, JavaScript),
Tailwind CSS, Supabase (Auth, Postgres, Storage), GSAP, Lenis smooth scroll, React Icons,
Zustand, React Hot Toast, and SweetAlert2. The admin dashboard is an installable PWA.

Palette: pure monochrome — off-white background `#F5F5F5`, ink `#111111`, accent grey `#4A4A4A`
(matching the Sneaker Supply badge logo). Fonts: **Anton** (display/headlines) + **Epilogue** (body).

---

## 1. Folder Structure

```
sneaker-supply/
├── public/
│   ├── images/
│   │   ├── logo.jpg
│   │   └── products/s1..s49/      # organized product galleries, ready to upload via admin
│   ├── videos/hero-1.mp4, hero-2.mp4, hero-3.mp4
│   ├── manifest-admin.json        # PWA manifest, admin dashboard only
│   └── admin-sw.js                # PWA service worker, admin dashboard only
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
│   │           ├── orders/                # order management
│   │           └── reviews/               # view/delete reviews across all products
│   ├── components/                # layout, home, shop, product, cart, admin, ui
│   ├── lib/                       # supabaseClient, products, orders, reviews, contact, auth, format, productText
│   ├── store/                     # useCartStore (localStorage), useAdminStore
│   └── hooks/useScrollReveal.js
└── .env.local                     # not committed — create it yourself, see below
```

The catalog launches **empty** — add real products through **Admin → Add Product**. The photos
in `public/images/products/s1..s49/` are pre-organized into per-product galleries so you can grab
a full set at once from the file picker when adding each one.

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
2. Pick an organization, name it, set a database password (save it somewhere), choose a region
   close to Pakistan (e.g. **Singapore**), click **Create new project**. Wait ~2 minutes.

### 3.2 Get your API keys

1. In the project, go to **Project Settings** (gear icon) → **API**.
2. Copy the **Project URL** and the **`anon` `public`** key into `.env.local`.
3. Restart `npm run dev` after saving `.env.local`.

### 3.3 Create the database tables + security rules

1. Left sidebar → **SQL Editor** → **New query**.
2. Open [`supabase/schema.sql`](./supabase/schema.sql), copy its *entire* contents, paste into
   the SQL Editor, and click **Run**.
3. This creates `products`, `orders`, `reviews`, `messages` tables, Row Level Security policies
   (anyone can browse products/reviews and submit orders/reviews/the contact form, but only a
   signed-in admin can create/edit/delete products, view/update orders, or read messages), and a
   public `products` Storage bucket with matching policies.

### 3.4 Enable the admin login

1. Left sidebar → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Enter the exact email + password you want to log in with at `/admin`. Leave "Auto confirm
   user" checked so the account is usable immediately.
3. Add more admins later the same way.

### 3.5 Add your products

Log into `/admin`, go to **Add Product**, and upload photos straight from
`public/images/products/s1..s49/` (each folder is one product's full gallery) along with
name/brand/category/price/sizes. No seed script needed — everything is added through the UI.

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
  - **Reviews**: see every review across every product, search, and delete any of them

### PWA (installable admin dashboard)

The `/admin` section ships its own manifest (`public/manifest-admin.json`) and service worker
(`public/admin-sw.js`), scoped only to `/admin/*` — the public storefront is **not** a PWA.
Open the admin dashboard in Chrome/Edge and use **"Install app" / "Add to Home Screen"** to add
it as a standalone app icon.

---

## 5. Key Features

- **Home**: full-viewport 3-video hero grid with GSAP entrance + parallax (single video on
  mobile), brand marquee, featured products, category tiles, brand story, real customer
  reviews (no placeholder testimonials — the section hides itself until real reviews exist), CTA banner
- **Shop**: search + category/brand filters + sorting, GSAP stagger reveal
- **Product Detail**: DP + gallery thumbnails, size selector, add to bag, reviews (read + submit),
  related products, sold-out state disables purchase
- **Cart**: Zustand store persisted to `localStorage`, slide-out drawer + full `/cart` page
- **Checkout**: name/phone/address/city form → Supabase order, **Cash on Delivery only** (no
  payment gateway), SweetAlert2 confirmation, exchange-only policy note
- **Admin**: Supabase Auth–gated dashboard, full product CRUD with multi-image Storage upload,
  sold/available toggle, order management, review moderation — installable as a PWA
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
dashboard (the `SUPABASE_SERVICE_ROLE_KEY` is only needed locally — never add it to a hosting
provider's env vars).
