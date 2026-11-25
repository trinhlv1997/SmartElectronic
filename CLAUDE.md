# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

The storefront is branded **LeMan Electrical & Lighting** (the repo, package, worker `smart-electronic`, D1 database and cart storage key keep the old technical name on purpose). It is an e-commerce storefront for LED lighting, electrical devices, smart-home devices and solar products, built with Next.js 15 (App Router), React 19, TypeScript (strict) and Tailwind CSS v4. All UI text is in Vietnamese and prices are integers in VND, formatted with `formatPrice` in `src/lib/format.ts`.

## Commands

```bash
npm install
npx wrangler d1 migrations apply DB --local   # local D1 schema + seed (first run / new migrations)
npm run dev         # dev server at http://localhost:3000
npm run build       # production build (also type-checks)
npm run lint        # next lint (ESLint 9 flat config via FlatCompat)
npm run typecheck   # tsc --noEmit
npm run preview     # OpenNext build + run on local workerd (Cloudflare runtime)
npm run deploy      # OpenNext build + deploy to Cloudflare Workers
```

Requires Node >= 22.12 (Wrangler). On this machine Node is installed at `~/.local/node/bin` (on PATH via `~/.zshrc`).

There is no test framework set up yet.

## Architecture

- **Design system.** The LeMan blue look is set by Tailwind v4 `@theme` tokens in `src/app/globals.css`: `brand` (royal blue, primary actions), `brand-dark`, `brand-50`/`brand-100` (sky tints), `navy` (wordmark, footer, admin sidebar), `gold` (accent: discount badges, small highlights) and `ink`, plus the Be Vietnam Pro font set up in `layout.tsx`. The logo is the text wordmark "LeMan®" + "Electrical & Lighting" (Header, Footer, admin); favicon is `src/app/icon.svg`. Use the tokens and do not hard-code colors; red stays only for errors/destructive actions/out-of-stock. Headings are bold and uppercase, and sections start with `SectionTitle`.
- **Layout.** `layout.tsx` renders `Header` (top bar, mega menu, mobile menu), a full-width `<main>` and `Footer`. `<main>` has no container, so each page wraps its own content in `mx-auto max-w-7xl px-4`. Inner pages use `PageBanner` for the title and breadcrumb.
- **Product search/filters.** All filter state lives in the URL (`q`, `category`, `min`, `max`, `stock=1`, `sale=1`, `sort`). `src/lib/productFilters.ts` is the single source for parsing (`parseFilters`, which ignores invalid values and swaps min/max) and for building URLs (`filtersHref`). Use it instead of hand-building query strings. Search is diacritic-insensitive through `normalizeText` and matches every token against name, SKU and category label. `FilterPanel`/`SortSelect` are client components that `router.push` a new URL. `ActiveFilters` (server) renders removable chips, and its "clear all" link keeps `sort`.
- **Static content.** Menus, solutions, featured fields, reasons, stats and news live in `src/data/site.ts`.
- **Site settings.** Hotline, email and address are edited in `/admin/settings` and stored in the D1 table `site_settings` (migration `0004`). Read them with `getContactInfo()` (`src/server/settings.ts`), which falls back to `DEFAULT_CONTACT` in `site.ts` if a key is missing or the table is not migrated yet. `(shop)/layout.tsx` passes them to `Header`/`Footer` as the `contact` prop; build `tel:` links with `telHref()`.

- **Data layer: Cloudflare D1.** Products, orders and order_items live in D1 (binding `DB`, schema in `migrations/`). All DB access goes through `src/server/` (`products.ts`, `orders.ts`), which maps snake_case rows to the camelCase types in `src/lib/types.ts`. `getDb()`/`getEnv()` in `src/server/db.ts` use `getCloudflareContext`. In `next dev`, `initOpenNextCloudflareForDev` (in `next.config.ts`) provides the local D1 (`.wrangler/state`) and `.dev.vars`. Categories are managed in `/admin/categories` and stored in the D1 table `categories` (migration `0005`, seeded with the original 8); `Category` is just the slug string. Read them with `getCategories()` (`src/server/categories.ts`, React `cache()` per request, falls back to `DEFAULT_CATEGORIES` if the table is missing) and pass them as props to client components (`Header`, `Footer`, `FilterPanel`, `ProductForm`). Use `isCategoryIn(categories)` / `labelOf(categories)` from `src/data/categories.ts` instead of a static list. A category's slug is fixed after creation (it is in URLs and `products.category`), and it can only be deleted when no product uses it (enforced inside the DELETE). Marketing copy is in `src/data/site.ts`. Schema changes require a new migration file, applied with `--local` and with `--remote` before deploy. Rerun `npm run cf-typegen` after changing `wrangler.jsonc` or `.dev.vars` keys; it regenerates the committed `cloudflare-env.d.ts`.
- **Route groups.** `app/layout.tsx` holds only the font and CSS. The storefront is `app/(shop)/` (Header/Footer/CartProvider, `force-dynamic` so D1 edits show immediately). The admin is `app/admin/`: `login/` is public, and `(panel)/` calls `requireAdmin()` in its layout.
- **Admin auth.** A single password (secret `ADMIN_PASSWORD`). The session is an HMAC-signed cookie (`AUTH_SECRET`) with no session table, implemented in `src/server/auth.ts`. Mutations are server actions in `src/app/admin/actions.ts`. Every action must call `requireAdmin()` itself, because server actions are public endpoints and the layout check does not protect them.
- **Server vs client split.** The catalog pages (`/`, `/products`, `/products/[slug]`) are async Server Components that read from D1. `/cart` and `/checkout` are Client Components. `useCartLines` fetches current prices and stock from `GET /api/products?ids=`.
- **Next 15 async params.** `params` and `searchParams` are Promises and must be awaited.
- **Cart state.** `src/context/CartContext.tsx` stores only `{ productId, quantity }` and persists it to localStorage. It reads storage after mount and exposes a `hydrated` flag; render cart-dependent UI only once `hydrated` is true to avoid hydration mismatches. `src/lib/useCartLines.ts` joins cart items with product data and computes the subtotal. 
- **Order trust boundary.** `POST /api/orders` goes to `createOrder` (`src/server/orders.ts`). It validates the customer, re-reads prices from D1 and writes the order, its items and the stock decrements in one `db.batch()` transaction. `CHECK (stock >= 0)` on `products` makes oversell attempts roll back the whole batch, so do not remove that constraint. `order_items` snapshots name and unit price. Cancelling an order in admin restores stock, and reopening it deducts stock again.
- **Product images.** Files live in KV (binding `MEDIA`, keys `img/<id>/lg` and `img/<id>/sm`), and metadata and order live in the D1 `product_images` table. The first row by `sort_order` is the cover. The browser compresses each image before upload (`src/lib/imageCompress.ts`: WebP, falling back to JPEG, at 1600px and 480px) and posts it to `POST /api/admin/images`. That is a route handler rather than a server action because server actions cap the body at 1MB, and it checks `isAdmin()` itself. `GET /img/[id]/[size]` serves images with `immutable` caching, so an image is never overwritten: replacing one means uploading a new id. Deleting an image or product must also delete the KV keys (`server/images.ts`), since D1 cascades only the rows. Render images with `coverImage`/`imageSrcSet` from `src/lib/images.ts` and plain `<img>`. The fallbacks are the external `imageUrl`, then the emoji `icon`. KV free tier allows 1k writes per day, and each upload costs 2 writes.
- `@/*` resolves to `src/*`.

## Deployment (Cloudflare Workers, free plan)

- CI/CD: Cloudflare Workers Builds is connected to the GitHub repo. A push to `main` builds with `npx opennextjs-cloudflare build` and deploys with `npx opennextjs-cloudflare deploy`, and other branches get preview versions. The Node version comes from `.nvmrc`. A push to `main` therefore deploys to production.
- Uses `@opennextjs/cloudflare`; config is in `wrangler.jsonc` (worker `smart-electronic`) and `open-next.config.ts`.
- The incremental cache is `static-assets-incremental-cache`, which is read-only and has no ISR. Storefront and admin pages are `force-dynamic`, so they do not depend on it. Always deploy via the npm scripts, not raw `wrangler deploy`.
- Free plan limits: about 10ms CPU per request and 3 MiB gzip worker size (currently about 0.9 MiB). Keep heavy work out of dynamic routes.
- Production secrets are `ADMIN_PASSWORD` and `AUTH_SECRET`, set with `wrangler secret put`. Without them `/admin` throws.
