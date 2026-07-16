#!/bin/sh
# Loads .env / .env.local (if present), then deploys.
# Auth, in order: CLOUDFLARE_API_TOKEN, CLOUDFLARE_TOKEN_API (legacy name),
# or wrangler's own OAuth login (`wrangler login`) when neither is set.
set -e
for f in .env .env.local; do
  if [ -f "$f" ]; then
    set -a
    . "./$f"
    set +a
  fi
done
if [ -n "${CLOUDFLARE_API_TOKEN:-$CLOUDFLARE_TOKEN_API}" ]; then
  export CLOUDFLARE_API_TOKEN="${CLOUDFLARE_API_TOKEN:-$CLOUDFLARE_TOKEN_API}"
fi
exec wrangler deploy "$@"
