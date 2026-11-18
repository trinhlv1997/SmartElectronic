# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

SmartElectronic is an e-commerce storefront for LED lighting, electrical devices, smart-home devices and solar products, built with Next.js 15 (App Router), React 19, TypeScript (strict) and Tailwind CSS v4. All UI text is in Vietnamese and prices are integers in VND, formatted with `formatPrice` in `src/lib/format.ts`.

## Commands

```bash
npm install
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

- **Design system.** The red/white brand look is set by Tailwind v4 `@theme` tokens in `src/app/globals.css` (`brand`, `brand-dark`, `brand-50`, `ink`, plus the Be Vietnam Pro font set up in `layout.tsx`). Use `bg-brand`/`text-brand` and do not hard-code colors. Headings are bold and uppercase, and sections start with `SectionTitle`.
- **Layout.** `layout.tsx` renders `Header` (top bar, mega menu, mobile menu), a full-width `<main>` and `Footer`. `<main>` has no container, so each page wraps its own content in `mx-auto max-w-7xl px-4`. Inner pages use `PageBanner` for the title and breadcrumb.
- **Static content.** Menus, solutions, featured fields, reasons, stats, news and contact info live in `src/data/site.ts`.

- **Data layer is mock and in-memory.** `src/data/products.ts` holds the product catalog and exposes query functions (`getProducts`, `getProductBySlug`, `getProductsByIds`, ...). Pages must go through these functions and never touch the array directly, so the data source can later be swapped for a database. Orders live in an in-memory `Map` in `src/lib/orders.ts` and are lost when the server restarts.
- **Server vs client split.** The catalog pages (`/`, `/products`, `/products/[slug]`) are Server Components. They read filters from `searchParams`, and filter links build URLs with `buildHref`, so there is no client-side filter state. `/cart` and `/checkout` are Client Components because they depend on the cart.
- **Next 15 async params.** `params` and `searchParams` are Promises and must be awaited.
- **Cart state.** `src/context/CartContext.tsx` stores only `{ productId, quantity }` and persists it to localStorage. It reads storage after mount and exposes a `hydrated` flag; render cart-dependent UI only once `hydrated` is true to avoid hydration mismatches. `src/lib/useCartLines.ts` joins cart items with product data and computes the subtotal. Because of that join, the catalog module is also bundled on the client.
- **Order trust boundary.** `POST /api/orders` (`src/app/api/orders/route.ts`) delegates to `createOrder`, which validates customer fields (VN phone `^0\d{9}$`), re-reads prices from the catalog and checks stock. Never trust prices or totals sent by the client.
- **Product images.** Products use an emoji `icon` as a placeholder. If you switch to real images, add their remote hosts to `images.remotePatterns` in `next.config.ts`.
- `@/*` resolves to `src/*`.

## Deployment (Cloudflare Workers, free plan)

- Uses `@opennextjs/cloudflare`; config is in `wrangler.jsonc` (worker `smart-electronic`) and `open-next.config.ts`.
- The incremental cache is `static-assets-incremental-cache`, which is read-only, has no R2 and no ISR. Prerendered pages are copied into `.open-next/assets/cdn-cgi/_next_cache` by the OpenNext `preview`/`deploy` commands. Running `wrangler dev`/`wrangler deploy` directly skips that step, so every request falls back to SSR and logs "Failed to set to read-only cache" errors. Always use the npm scripts.
- Do not add `revalidate`/ISR, `unstable_cache` writes or on-demand revalidation unless you also switch to the R2/KV cache, which requires a paid binding setup.
- Free plan limits: about 10ms CPU per request and 3 MiB gzip worker size (currently about 0.9 MiB). Keep heavy work out of dynamic routes.
- The in-memory order store in `src/lib/orders.ts` is per-isolate on Workers, so orders are effectively not persisted. Move it to D1 or KV before relying on orders.
