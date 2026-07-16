#!/usr/bin/env python3
"""Copy required resources from the WordPress backup into public/.

Sources:  backup/backup-7.16.2026_12-18-42_kguhvose/homedir/public_html
Targets:  public/wp-content/uploads/...   (original URL paths preserved)
          public/theme/...                (forked Kale theme CSS + assets)
Only files referenced by src/data/cakes.json (grid src, srcset variants,
zoom image) plus logo/icons/theme assets are copied.
"""
import json
import shutil
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parent.parent
WP = ROOT / "backup/backup-7.16.2026_12-18-42_kguhvose/homedir/public_html"
PUBLIC = ROOT / "public"

items = json.loads((ROOT / "src/data/cakes.json").read_text())

urls: set[str] = set()
for it in items:
    urls.add(it["src"])
    if it.get("zoom"):
        urls.add(it["zoom"])
    for part in filter(None, (it.get("srcset") or "").split(",")):
        urls.add(part.strip().split(" ")[0])

# Logo (header) + og image
urls.update([
    "https://ngan.vn/wp-content/uploads/2019/09/logo-small.png",
    "https://ngan.vn/wp-content/uploads/2019/09/logo-small-300x140.png",
    "https://ngan.vn/wp-content/uploads/2018/12/logo-ngan-black.png",
])

copied = missing = 0
for url in sorted(urls):
    rel = unquote(urlparse(url).path.lstrip("/"))
    src = WP / rel
    dst = PUBLIC / rel
    if not src.exists():
        print(f"MISSING {rel}", file=sys.stderr)
        missing += 1
        continue
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)
    copied += 1

# Theme assets: CSS files + icon/img/font directories
theme_src = WP / "wp-content/themes/kale"
theme_dst = PUBLIC / "theme"
theme_dst.mkdir(parents=True, exist_ok=True)
for name in ["style.css", "duyet-custom.css", "duyet-custom-responsive.css"]:
    shutil.copy2(theme_src / name, theme_dst / name)
for sub in ["assets/css", "assets/icon", "assets/img", "assets/fonts"]:
    s = theme_src / sub
    if s.exists():
        shutil.copytree(s, theme_dst / sub, dirs_exist_ok=True)

total_bytes = sum(f.stat().st_size for f in PUBLIC.rglob("*") if f.is_file())
print(f"copied={copied} missing={missing} public_size={total_bytes/1e6:.1f}MB")
