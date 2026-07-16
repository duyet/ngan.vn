# CLAUDE.md

Static rebuild of ngan.vn — TanStack Start, fully prerendered (`/` + `/cake`),
deployed as an assets-only Cloudflare Worker (`ngan-vn`).

## Commands

Use **pnpm** (not bun/npm).

```sh
pnpm dev          # dev server
pnpm build        # vite build + prerender into dist/client
pnpm run deploy   # build + wrangler deploy (env exports first — see README "Deploy")
```

## Layout

- `src/routes/` — `index` (blank landing, centered logo → `/cake`), `cake` (gallery + farewell letter)
- `src/data/cakes.json` — 150 gallery items
- `public/theme/` — original Kale theme CSS, verbatim; don't edit
- `public/cake-init.js` — jQuery init for the gallery (isotope + Magnific Popup)
- `public/cake-extra.css` — overrides loaded after the theme; put /cake style changes here
- `backup/` — WordPress backup, gitignored, reference only

## Gotchas

- `/cake` keeps the original jQuery stack loaded after hydration — React must not
  fight its DOM mutations.
- `public/_redirects`: exact rules must come BEFORE splat rules (Workers demotes
  rules after a splat to dynamic, capped at 100).
- After `pnpm build`, restart any running `vite preview` — it serves stale HTML
  with old asset hashes.
- Prerender uses `autoSubfolderIndex: false` (output is `dist/client/cake.html`)
  and `crawlLinks: false`.
- The ngan.vn domain still points at the old WordPress host; only
  https://ngan-vn.duyet.workers.dev serves this build.
