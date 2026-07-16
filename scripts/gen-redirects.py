#!/usr/bin/env python3
"""Generate public/_redirects: old WordPress URLs -> new static pages."""
import json
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
items = json.loads((ROOT / "src/data/cakes.json").read_text())

# Exact-match (static) rules first — rules that follow a splat line get
# demoted to dynamic, and Workers caps dynamic rules at 100.
lines = [
    "# Old WordPress URLs -> new static site",
    "/blog/ / 301",
    "/banh-kem/banh-hoa/ /cake?filter=banh-hoa 301",
    "/banh-kem/banh-bup-be/ /cake?filter=banh-bup-be 301",
    "/banh-kem/banh-trang-tri-hinh-ve/ /cake?filter=banh-trang-tri-hinh-ve 301",
    "/banh-kem/banh-tang-banh-cuoi/ /cake?filter=banh-tang-banh-cuoi 301",
    "/banh-kem/banh-mau-khac/ /cake?filter=banh-mau-khac 301",
    "/banh-kem/banh-mau-don-gian/ /cake?filter=banh-mau-don-gian 301",
    "/banh-kem/cupcake/ /cake?filter=cupcake 301",
    "/banh-kem/ /cake 301",
]

seen = set()
for it in items:
    if not it.get("link"):
        continue
    path = urlparse(it["link"]).path
    if path in seen:
        continue
    seen.add(path)
    lines.append(f"{path} /cake 301")

# Splat rules last
lines.append("/banh-lam-qua-tang-dai-tiec/* /cake 301")

out = ROOT / "public/_redirects"
out.write_text("\n".join(lines) + "\n")
print(f"wrote {out} ({len(lines)} rules)")
