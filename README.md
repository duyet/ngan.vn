# ngan.vn

<p align="center">
  <img src="public/wp-content/uploads/2019/09/logo-small.png" alt="Ngan.vn — Cakes & Sweets" width="300">
</p>

Static rebuild of [ngan.vn](https://ngan.vn) — migrated from WordPress to
[TanStack Start](https://tanstack.com/start), fully prerendered and deployed to
Cloudflare Workers as static assets.

Live at: https://ngan-vn.duyet.workers.dev

## Pages

- `/` — blank landing page, centered logo linking to `/cake`.
- `/cake` — the original "Cakes & Sweets" gallery: original theme CSS, isotope
  masonry grid, category filter tabs, Magnific Popup zoom, and the farewell
  letter card under the logo.

Old WordPress URLs are 301-redirected via `public/_redirects`.

## Develop

```sh
pnpm install
pnpm dev        # dev server
pnpm build      # prerender / and /cake into dist/client
```

## Deploy

```sh
pnpm run deploy
```

Auth either via `wrangler login`, or copy `.env.example` to `.env.local` and
fill in the values — the deploy script loads `.env` / `.env.local`
automatically.
