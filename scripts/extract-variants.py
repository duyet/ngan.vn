#!/usr/bin/env python3
"""Extract per-cake image variants from the WP backup into cakes.json.

Each old WP detail page had extra photos of the same cake. Sources, merged in
order (primary grid image first, then post_content order, then attachments
parented to the post):
  1. <img src> filenames in post_content — mobile-app uploads have broken
     /storage/emulated/... paths, matched to attachment guids by basename.
  2. Attachments with post_parent == post ID.

Copies any missing image files from the backup into public/wp-content/uploads
(preferring the -scaled rendition WP serves as "full"), then writes a
`variants` array per item: [{src, thumb}] with absolute https://ngan.vn/...
URLs like `src`. `thumb` is the smallest WP rendition (for the lightbox's
mini-thumbnail strip).

Usage: python3 scripts/extract-variants.py
"""

import glob
import json
import os
import re
import shutil
import sys
from collections import defaultdict

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CAKES = os.path.join(ROOT, 'src/data/cakes.json')
DUMPS = glob.glob(os.path.join(ROOT, 'backup/backup-*/mysql/kguhvose_wp_e8dbw.sql'))
PUBHTML = glob.glob(os.path.join(ROOT, 'backup/backup-*/homedir/public_html'))

COLS = ['ID', 'post_author', 'post_date', 'post_date_gmt', 'post_content',
        'post_title', 'post_excerpt', 'post_status', 'comment_status',
        'ping_status', 'post_password', 'post_name', 'to_ping', 'pinged',
        'post_modified', 'post_modified_gmt', 'post_content_filtered',
        'post_parent', 'guid', 'menu_order', 'post_type', 'post_mime_type',
        'comment_count']


def parse_tuples(stmt):
    """Parse SQL VALUES tuples respecting quotes and backslash escapes."""
    rows, row, cur, i, n = [], [], [], 0, len(stmt)
    in_str = False
    depth = 0
    while i < n:
        c = stmt[i]
        if in_str:
            if c == '\\':
                cur.append(stmt[i + 1])
                i += 2
                continue
            if c == "'":
                if i + 1 < n and stmt[i + 1] == "'":
                    cur.append("'")
                    i += 2
                    continue
                in_str = False
            else:
                cur.append(c)
        else:
            if c == "'":
                in_str = True
            elif c == '(':
                depth += 1
                if depth == 1:
                    row, cur = [], []
            elif c == ',' and depth == 1:
                row.append(''.join(cur))
                cur = []
            elif c == ')' and depth == 1:
                row.append(''.join(cur))
                rows.append(row)
                depth = 0
                cur = []
            elif depth == 1:
                cur.append(c)
        i += 1
    return rows


def norm_base(name):
    """Basename without extension and WP's -N duplicate-upload suffix."""
    base = os.path.splitext(name)[0]
    return re.sub(r'-\d+$', '', base).lower()


def main():
    if not DUMPS or not PUBHTML:
        sys.exit('backup dump or public_html not found under backup/')
    sql = open(DUMPS[0], encoding='utf-8', errors='replace').read()
    inserts = re.findall(r"INSERT INTO `AVXyJ_posts`[^\n]*?VALUES\s*(.*?);\n",
                         sql, re.S)
    posts = [dict(zip(COLS, r)) for s in inserts for r in parse_tuples(s)
             if len(r) == len(COLS)]

    atts = [p for p in posts if p['post_type'] == 'attachment'
            and p['post_mime_type'].startswith('image/')]
    content_by_id = {p['ID']: p['post_content'] for p in posts
                     if p['post_type'] == 'post'}
    by_parent = defaultdict(list)
    by_base = defaultdict(list)
    for a in atts:
        by_parent[a['post_parent']].append(a)
        by_base[norm_base(os.path.basename(a['guid']))].append(a)

    cakes = json.load(open(CAKES))
    copied, missing_files, multi = 0, [], 0

    def upload_path(url):
        """https://ngan.vn/wp-content/... -> /wp-content/... (or None)."""
        m = re.search(r'/wp-content/uploads/.+', url)
        return m.group(0) if m else None

    def best_file(path):
        """Prefer the -scaled rendition if it exists in the backup."""
        base, ext = os.path.splitext(path)
        scaled = base + '-scaled' + ext
        if os.path.exists(PUBHTML[0] + scaled):
            return scaled
        if os.path.exists(PUBHTML[0] + path):
            return path
        return None

    def thumb_file(path):
        """Smallest WxH rendition of the image, for thumbnail strips."""
        base, ext = os.path.splitext(path)
        best, best_dim = None, None
        for f in glob.glob(PUBHTML[0] + base + '-[0-9]*x[0-9]*' + ext):
            m = re.search(r'-(\d+)x(\d+)' + re.escape(ext) + '$', f)
            if not m:
                continue
            dim = max(int(m.group(1)), int(m.group(2)))
            if best_dim is None or dim < best_dim:
                best, best_dim = f[len(PUBHTML[0]):], dim
        return best

    for item in cakes:
        pid = str(item['id'])
        primary_key = norm_base(
            os.path.basename(upload_path(item['src']) or item['src'])
            .replace('-scaled', ''))

        ordered, seen = [], set()

        def add(att):
            key = norm_base(os.path.basename(att['guid']))
            if key in seen:
                return
            seen.add(key)
            ordered.append(att)

        # 1. content order (broken mobile paths matched by basename)
        content = content_by_id.get(pid, '')
        for src in re.findall(r'<img[^>]+src="([^"]+)"', content):
            key = norm_base(os.path.basename(src))
            for att in by_base.get(key, [])[:1]:
                add(att)
        # 2. attachments parented to the post
        for att in sorted(by_parent.get(pid, []), key=lambda a: int(a['ID'])):
            add(att)

        def copy_in(found):
            dst = os.path.join(ROOT, 'public') + found
            if not os.path.exists(dst):
                os.makedirs(os.path.dirname(dst), exist_ok=True)
                shutil.copy2(PUBHTML[0] + found, dst)
                return 1
            return 0

        variants = []
        for att in ordered:
            path = upload_path(att['guid'])
            if not path:
                continue
            found = best_file(path)
            if not found:
                missing_files.append(path)
                continue
            copied += copy_in(found)
            thumb = thumb_file(path)
            if thumb:
                copied += copy_in(thumb)
            variants.append({
                'src': 'https://ngan.vn' + found,
                'thumb': 'https://ngan.vn' + (thumb or found),
            })

        # primary (the grid image) always first
        primary = next((v for v in variants if norm_base(
            os.path.basename(v['src']).replace('-scaled', ''))
            == primary_key), None)
        zoom_url = item.get('zoom') or item['src']
        if primary:
            variants.remove(primary)
            variants.insert(0, primary)
        else:
            path = upload_path(zoom_url)
            thumb = thumb_file(path) if path else None
            if thumb:
                copied += copy_in(thumb)
            variants.insert(0, {
                'src': zoom_url,
                'thumb': 'https://ngan.vn' + thumb if thumb else zoom_url,
            })
        item['variants'] = variants
        if len(variants) > 1:
            multi += 1

    json.dump(cakes, open(CAKES, 'w'), ensure_ascii=False, indent=1)
    print(f'{len(cakes)} items | {multi} with >1 variant | '
          f'{copied} files copied | {len(missing_files)} missing')
    for p in missing_files[:10]:
        print('  missing:', p)


if __name__ == '__main__':
    main()
