# ngan.vn

Static rebuild of [ngan.vn](https://ngan.vn) — migrated from WordPress (Kale
theme fork) to [TanStack Start](https://tanstack.com/start), fully prerendered
and deployed to Cloudflare Workers as static assets.

## Pages

- `/` — landing page. Blank white page, centered logo linking to `/cake`.
- `/cake` — the original "Cakes & Sweets" gallery, reproduced 1:1 from the
  WordPress site on desktop: same theme CSS (`public/theme/`), isotope masonry
  grid, category filters, Magnific Popup zoom with title, plus the farewell
  letter card under the header. The mobile menu is redesigned (white sliding
  panel, hamburger/X toggle) in `public/cake-extra.css`.

Old WordPress URLs (post pages, category pages, `/blog/`) are 301-redirected
via `public/_redirects`.

## Structure

```
src/routes/           # __root, index (landing), cake (gallery)
src/data/cakes.json   # 150 gallery items extracted from the live site
public/theme/         # forked Kale theme CSS + assets (from the WP backup)
public/wp-content/    # uploaded images, original URL paths preserved
public/cake-init.js   # jQuery init for /cake (isotope + magnific, as before)
scripts/              # copy-assets.py, gen-redirects.py (backup/ -> public/)
backup/               # WordPress full backup — reference only, gitignored
```

## Develop

```sh
pnpm install
pnpm dev        # dev server
pnpm build      # vite build + prerender / and /cake into dist/client
```

## Deploy

Requires `CLOUDFLARE_TOKEN_API` in `.env.local`.

```sh
export CLOUDFLARE_API_TOKEN=$(grep CLOUDFLARE_TOKEN_API .env.local | cut -d= -f2)
export CLOUDFLARE_ACCOUNT_ID=***REMOVED***
pnpm run deploy   # build + wrangler deploy (assets-only worker)
```

Deployed at: https://ngan-vn.duyet.workers.dev

## Regenerating data/assets

Only needed if the backup or item list changes:

```sh
python3 scripts/copy-assets.py     # copy referenced images + theme from backup/
python3 scripts/gen-redirects.py   # rebuild public/_redirects
```
