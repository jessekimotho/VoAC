#!/usr/bin/env python3
"""Export WordPress WXR XML files into smaller migration artifacts.

This intentionally uses only the Python standard library so it can run in a
plain project folder. It keeps WordPress HTML content intact, which makes the
output usable in SvelteKit via mdsvex/MDX or a later HTML-to-markdown pass.
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import textwrap
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from datetime import datetime
from html import unescape
from pathlib import Path
from typing import Any


NS = {
    "content": "http://purl.org/rss/1.0/modules/content/",
    "dc": "http://purl.org/dc/elements/1.1/",
    "excerpt": "http://wordpress.org/export/1.2/excerpt/",
    "wp": "http://wordpress.org/export/1.2/",
}


@dataclass
class WxrItem:
    source: str
    source_rank: int
    title: str
    link: str
    guid: str
    creator: str
    content: str
    excerpt: str
    post_id: str
    post_date: str
    post_date_gmt: str
    post_name: str
    status: str
    post_type: str
    parent: str
    menu_order: int
    attachment_url: str
    categories: list[dict[str, str]] = field(default_factory=list)
    postmeta: dict[str, list[str]] = field(default_factory=dict)
    comments: list[dict[str, str]] = field(default_factory=list)

    @property
    def slug(self) -> str:
        return slugify(self.post_name or self.title or self.post_id or "untitled")

    @property
    def dedupe_key(self) -> tuple[str, str, str]:
        day = (self.post_date or self.post_date_gmt or "")[:10]
        return (self.post_type, self.slug, day)


def clean_xml_bytes(path: Path) -> bytes:
    data = path.read_bytes()
    return data.replace(b"\x00", b"")


def text(node: ET.Element, path: str, default: str = "") -> str:
    found = node.find(path, NS)
    if found is None or found.text is None:
        return default
    return found.text.strip()


def child_text(node: ET.Element, child_name: str, default: str = "") -> str:
    found = node.find(child_name, NS)
    if found is None or found.text is None:
        return default
    return found.text.strip()


def parse_categories(channel: ET.Element) -> list[dict[str, str]]:
    categories = []
    for cat in channel.findall("wp:category", NS):
        categories.append(
            {
                "id": text(cat, "wp:term_id"),
                "slug": text(cat, "wp:category_nicename"),
                "name": text(cat, "wp:cat_name"),
                "parent": text(cat, "wp:category_parent"),
            }
        )
    return categories


def parse_authors(channel: ET.Element) -> list[dict[str, str]]:
    authors = []
    for author in channel.findall("wp:author", NS):
        authors.append(
            {
                "id": text(author, "wp:author_id"),
                "login": text(author, "wp:author_login"),
                "email": text(author, "wp:author_email"),
                "display_name": text(author, "wp:author_display_name"),
                "first_name": text(author, "wp:author_first_name"),
                "last_name": text(author, "wp:author_last_name"),
            }
        )
    return authors


def parse_item(item: ET.Element, source: str, source_rank: int) -> WxrItem:
    postmeta: dict[str, list[str]] = defaultdict(list)
    for meta in item.findall("wp:postmeta", NS):
        key = text(meta, "wp:meta_key")
        value = text(meta, "wp:meta_value")
        if key:
            postmeta[key].append(value)

    comments = []
    for comment in item.findall("wp:comment", NS):
        comments.append(
            {
                "id": text(comment, "wp:comment_id"),
                "author": text(comment, "wp:comment_author"),
                "author_email": text(comment, "wp:comment_author_email"),
                "date": text(comment, "wp:comment_date"),
                "content": text(comment, "wp:comment_content"),
                "approved": text(comment, "wp:comment_approved"),
                "parent": text(comment, "wp:comment_parent"),
            }
        )

    cats = []
    for cat in item.findall("category"):
        cats.append(
            {
                "domain": cat.attrib.get("domain", ""),
                "nicename": cat.attrib.get("nicename", ""),
                "name": (cat.text or "").strip(),
            }
        )

    return WxrItem(
        source=source,
        source_rank=source_rank,
        title=child_text(item, "title"),
        link=child_text(item, "link"),
        guid=child_text(item, "guid"),
        creator=text(item, "dc:creator"),
        content=text(item, "content:encoded"),
        excerpt=text(item, "excerpt:encoded"),
        post_id=text(item, "wp:post_id"),
        post_date=text(item, "wp:post_date"),
        post_date_gmt=text(item, "wp:post_date_gmt"),
        post_name=text(item, "wp:post_name"),
        status=text(item, "wp:status"),
        post_type=text(item, "wp:post_type"),
        parent=text(item, "wp:post_parent"),
        menu_order=int(text(item, "wp:menu_order", "0") or 0),
        attachment_url=text(item, "wp:attachment_url"),
        categories=cats,
        postmeta=dict(postmeta),
        comments=comments,
    )


def parse_wxr(path: Path, source_rank: int) -> tuple[dict[str, Any], list[WxrItem]]:
    root = ET.fromstring(clean_xml_bytes(path))
    channel = root.find("channel")
    if channel is None:
        raise ValueError(f"{path} does not contain an RSS channel")

    site = {
        "source": path.name,
        "title": child_text(channel, "title"),
        "link": child_text(channel, "link"),
        "description": child_text(channel, "description"),
        "pubDate": child_text(channel, "pubDate"),
        "language": child_text(channel, "language"),
        "base_site_url": text(channel, "wp:base_site_url"),
        "base_blog_url": text(channel, "wp:base_blog_url"),
        "authors": parse_authors(channel),
        "categories": parse_categories(channel),
    }
    items = [parse_item(item, path.name, source_rank) for item in channel.findall("item")]
    return site, items


def slugify(value: str) -> str:
    value = unescape(value).lower()
    value = re.sub(r"[^a-z0-9]+", "-", value)
    return value.strip("-") or "untitled"


def frontmatter_value(value: Any) -> str:
    return json.dumps(value, ensure_ascii=False)


def item_to_dict(item: WxrItem) -> dict[str, Any]:
    return {
        "source": item.source,
        "title": item.title,
        "link": item.link,
        "guid": item.guid,
        "creator": item.creator,
        "post_id": item.post_id,
        "post_date": item.post_date,
        "post_date_gmt": item.post_date_gmt,
        "slug": item.slug,
        "wordpress_slug": item.post_name,
        "status": item.status,
        "post_type": item.post_type,
        "parent": item.parent,
        "menu_order": item.menu_order,
        "attachment_url": item.attachment_url,
        "categories": item.categories,
        "excerpt": item.excerpt,
        "postmeta": item.postmeta,
        "comments": item.comments,
        "content": item.content,
    }


def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def write_content_file(path: Path, item: WxrItem) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    frontmatter = {
        "title": item.title,
        "date": item.post_date or item.post_date_gmt,
        "slug": item.slug,
        "status": item.status,
        "type": item.post_type,
        "author": item.creator,
        "source": item.source,
        "originalUrl": item.link,
        "categories": [cat["name"] for cat in item.categories if cat.get("domain") == "category"],
        "tags": [cat["name"] for cat in item.categories if cat.get("domain") == "post_tag"],
        "excerpt": item.excerpt,
        "commentsCount": len(item.comments),
    }
    lines = ["---"]
    lines.extend(f"{key}: {frontmatter_value(value)}" for key, value in frontmatter.items())
    lines.extend(["---", "", item.content, ""])
    path.write_text("\n".join(lines), encoding="utf-8")


def choose_preferred(items: list[WxrItem]) -> tuple[list[WxrItem], list[list[WxrItem]]]:
    grouped: dict[tuple[str, str, str], list[WxrItem]] = defaultdict(list)
    for item in items:
        grouped[item.dedupe_key].append(item)

    preferred = []
    duplicates = []
    for group in grouped.values():
        if len(group) > 1:
            duplicates.append(sorted(group, key=lambda x: x.source_rank, reverse=True))
        preferred.append(
            sorted(
                group,
                key=lambda x: (
                    x.source_rank,
                    x.status == "publish",
                    len(x.content or ""),
                    len(x.comments),
                ),
                reverse=True,
            )[0]
        )
    return sorted(preferred, key=lambda x: (x.post_type, x.post_date, x.slug)), duplicates


def write_chunks(out_dir: Path, items: list[WxrItem], chunk_size: int) -> None:
    chunks_dir = out_dir / "chunks"
    chunks_dir.mkdir(parents=True, exist_ok=True)
    for post_type in sorted({item.post_type or "unknown" for item in items}):
        typed = [item for item in items if (item.post_type or "unknown") == post_type]
        for index in range(0, len(typed), chunk_size):
            chunk = typed[index : index + chunk_size]
            write_json(
                chunks_dir / f"{post_type}-{index // chunk_size + 1:03d}.json",
                [item_to_dict(item) for item in chunk],
            )


def write_readme(out_dir: Path, summary: dict[str, Any]) -> None:
    readme = f"""# VoAC WordPress Migration Export

Generated from the two WordPress WXR XML exports in the parent folder.

## What These Files Are

- `manifest.json`: site-level metadata, counts, and dedupe notes.
- `content/posts/*.md`: published/draft WordPress posts with HTML preserved inside frontmatter-wrapped Markdown.
- `content/pages/*.md`: WordPress pages in the same format.
- `data/all-items.json`: every preferred merged WordPress item, including attachments and menus.
- `data/attachments.json`: attachment records and original media URLs from WordPress.
- `chunks/*.json`: smaller per-type JSON batches for AI review or staged import.
- `raw-cleaned/*.xml`: XML copies with null bytes removed so parsers do not choke.

## Recommended Path To SvelteKit

1. Treat `content/posts` and `content/pages` as the editorial source of truth.
2. Use mdsvex/MDX if you want to render the preserved WordPress HTML directly.
3. Download images from `data/attachments.json` into `static/uploads` or upload them to Supabase Storage.
4. Replace old `voiceofanafricanchild.com` and `voiceofanafricanchild.wordpress.com` URLs after media locations are settled.
5. Keep `manifest.json` and `chunks` around for audit/reprocessing.

## Current Summary

```json
{json.dumps(summary, indent=2, ensure_ascii=False)}
```
"""
    (out_dir / "README.md").write_text(readme, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("xml", nargs="+", type=Path, help="WordPress WXR XML exports")
    parser.add_argument("--out", type=Path, default=Path("migration_export"))
    parser.add_argument("--chunk-size", type=int, default=20)
    args = parser.parse_args()

    if args.out.exists():
        shutil.rmtree(args.out)
    args.out.mkdir(parents=True)

    all_items: list[WxrItem] = []
    sites = []
    for rank, path in enumerate(args.xml, start=1):
        site, items = parse_wxr(path, rank)
        sites.append(site | {"item_count": len(items), "type_counts": dict(Counter(i.post_type for i in items))})
        all_items.extend(items)
        cleaned = args.out / "raw-cleaned" / path.name
        cleaned.parent.mkdir(parents=True, exist_ok=True)
        cleaned.write_bytes(clean_xml_bytes(path))

    preferred, duplicates = choose_preferred(all_items)
    counts = Counter(item.post_type or "unknown" for item in preferred)
    status_counts = Counter(item.status or "unknown" for item in preferred)

    posts_and_pages = [item for item in preferred if item.post_type in {"post", "page"}]
    for item in posts_and_pages:
        folder = "posts" if item.post_type == "post" else "pages"
        date_prefix = ""
        if item.post_type == "post" and (item.post_date or item.post_date_gmt):
            date_prefix = (item.post_date or item.post_date_gmt)[:10] + "-"
        write_content_file(args.out / "content" / folder / f"{date_prefix}{item.slug}.md", item)

    attachments = [item_to_dict(item) for item in preferred if item.post_type == "attachment"]
    write_json(args.out / "data" / "all-items.json", [item_to_dict(item) for item in preferred])
    write_json(args.out / "data" / "attachments.json", attachments)
    write_chunks(args.out, preferred, args.chunk_size)

    duplicate_report = [
        [
            {
                "source": item.source,
                "type": item.post_type,
                "title": item.title,
                "slug": item.slug,
                "date": item.post_date,
                "status": item.status,
                "content_length": len(item.content or ""),
            }
            for item in group
        ]
        for group in duplicates
    ]
    write_json(args.out / "data" / "possible-duplicates.json", duplicate_report)

    summary = {
        "sources": sites,
        "total_raw_items": len(all_items),
        "merged_preferred_items": len(preferred),
        "preferred_type_counts": dict(counts),
        "preferred_status_counts": dict(status_counts),
        "possible_duplicate_groups": len(duplicates),
        "content_files": {
            "posts": len([i for i in posts_and_pages if i.post_type == "post"]),
            "pages": len([i for i in posts_and_pages if i.post_type == "page"]),
        },
    }
    write_json(args.out / "manifest.json", summary)
    write_readme(args.out, summary)
    print(textwrap.dedent(
        f"""
        Wrote {args.out}
        Preferred merged items: {len(preferred)}
        Posts/pages exported: {len(posts_and_pages)}
        Possible duplicate groups: {len(duplicates)}
        """
    ).strip())


if __name__ == "__main__":
    main()
