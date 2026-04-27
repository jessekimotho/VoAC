# VoAC WordPress Migration Export

Generated from the two WordPress WXR XML exports in the parent folder.

## What These Files Are

- `manifest.json`: site-level metadata, counts, and dedupe notes.
- `content/posts/*.md`: published/draft WordPress posts with HTML preserved inside frontmatter-wrapped Markdown.
- `content/pages/*.md`: WordPress pages in the same format.
- `data/all-items.json`: every preferred merged WordPress item, including attachments and menus.
- `data/attachments.json`: attachment records and original media URLs from WordPress.
- `chunks/*.json`: smaller per-type JSON batches for AI review or staged import.
- `raw-cleaned/*.xml`: XML copies with null bytes removed so parsers do not choke.
- `../tools/export_wxr.py`: repeatable exporter that generated this folder.
- `../tools/download_wordpress_media.py`: optional downloader for the attachment URLs.

## Recommended Path To SvelteKit

1. Treat `content/posts` and `content/pages` as the editorial source of truth.
2. Use mdsvex/MDX if you want to render the preserved WordPress HTML directly.
3. Download images from `data/attachments.json` into `static/uploads` or upload them to Supabase Storage.
4. Replace old `voiceofanafricanchild.com` and `voiceofanafricanchild.wordpress.com` URLs after media locations are settled.
5. Keep `manifest.json` and `chunks` around for audit/reprocessing.

To rerun the export:

```bash
python3 tools/export_wxr.py voiceofanafricanchild.wordpress.2019-03-11.001.xml voiceofanafricanchild.WordPress.2019-03-12.xml --out migration_export --chunk-size 20
```

To attempt media download later:

```bash
python3 tools/download_wordpress_media.py --attachments migration_export/data/attachments.json --out migration_export/media
```

## Current Summary

```json
{
  "sources": [
    {
      "source": "voiceofanafricanchild.wordpress.2019-03-11.001.xml",
      "title": "Voice of an African Child.",
      "link": "https://voiceofanafricanchild.wordpress.com",
      "description": "Stories unbound.",
      "pubDate": "Mon, 11 Mar 2019 10:55:35 +0000",
      "language": "",
      "base_site_url": "http://wordpress.com/",
      "base_blog_url": "https://voiceofanafricanchild.wordpress.com",
      "authors": [
        {
          "id": "116289037",
          "login": "voiceofanafricanchild",
          "email": "Richardokenye4@gmail.com",
          "display_name": "Voice Of An African Child",
          "first_name": "Richard Okenye",
          "last_name": ""
        }
      ],
      "categories": [
        {
          "id": "586915407",
          "slug": "forafrica-series",
          "name": "#FORAFRICA SERIES",
          "parent": ""
        },
        {
          "id": "5685",
          "slug": "the-city",
          "name": "THE CITY",
          "parent": ""
        },
        {
          "id": "1",
          "slug": "uncategorized",
          "name": "Uncategorized",
          "parent": ""
        },
        {
          "id": "260361",
          "slug": "village-stories",
          "name": "VILLAGE STORIES",
          "parent": ""
        },
        {
          "id": "588014337",
          "slug": "whack-poetry",
          "name": "WHACK POETRY",
          "parent": ""
        }
      ],
      "item_count": 88,
      "type_counts": {
        "page": 2,
        "nav_menu_item": 8,
        "post": 42,
        "attachment": 34,
        "feedback": 2
      }
    },
    {
      "source": "voiceofanafricanchild.WordPress.2019-03-12.xml",
      "title": "Voice of an African Child",
      "link": "https://voiceofanafricanchild.com",
      "description": "Stories unbound.",
      "pubDate": "Tue, 12 Mar 2019 06:49:28 +0000",
      "language": "en-US",
      "base_site_url": "https://voiceofanafricanchild.com",
      "base_blog_url": "https://voiceofanafricanchild.com",
      "authors": [
        {
          "id": "2",
          "login": "Richard",
          "email": "richardokenye4@gmail.com",
          "display_name": "VoAC",
          "first_name": "Richard",
          "last_name": "Okenye"
        },
        {
          "id": "3",
          "login": "Solomonjesse",
          "email": "solomonjesse@gmail.com",
          "display_name": "Solomon Jesse",
          "first_name": "Jesse",
          "last_name": "Solomon"
        }
      ],
      "categories": [
        {
          "id": "2",
          "slug": "forafrica-series",
          "name": "#ForAfrica Series",
          "parent": ""
        },
        {
          "id": "3",
          "slug": "book-review",
          "name": "Book Review",
          "parent": ""
        },
        {
          "id": "100",
          "slug": "fashion",
          "name": "Fashion",
          "parent": ""
        },
        {
          "id": "4",
          "slug": "food-for-thought",
          "name": "Food for thought",
          "parent": ""
        },
        {
          "id": "101",
          "slug": "gaming",
          "name": "Gaming",
          "parent": ""
        },
        {
          "id": "5",
          "slug": "high-school",
          "name": "High School",
          "parent": ""
        },
        {
          "id": "6",
          "slug": "love-war-and-the-heart",
          "name": "Love, War and the Heart",
          "parent": ""
        },
        {
          "id": "102",
          "slug": "music",
          "name": "Music",
          "parent": ""
        },
        {
          "id": "7",
          "slug": "politricks",
          "name": "Politricks",
          "parent": ""
        },
        {
          "id": "8",
          "slug": "slice-of-life",
          "name": "Slice of Life",
          "parent": ""
        },
        {
          "id": "9",
          "slug": "the-city",
          "name": "The City",
          "parent": ""
        },
        {
          "id": "10",
          "slug": "travel",
          "name": "Travel",
          "parent": ""
        },
        {
          "id": "1",
          "slug": "uncategorized",
          "name": "Uncategorized",
          "parent": ""
        },
        {
          "id": "11",
          "slug": "village-stories",
          "name": "Village Stories",
          "parent": ""
        },
        {
          "id": "12",
          "slug": "whack-poetry",
          "name": "Whack Poetry",
          "parent": ""
        },
        {
          "id": "13",
          "slug": "writing-about-writing",
          "name": "Writing about Writing",
          "parent": ""
        }
      ],
      "item_count": 158,
      "type_counts": {
        "attachment": 77,
        "custom_css": 1,
        "mt_pp": 2,
        "page": 8,
        "nav_menu_item": 6,
        "post": 64
      }
    }
  ],
  "total_raw_items": 246,
  "merged_preferred_items": 213,
  "preferred_type_counts": {
    "attachment": 111,
    "custom_css": 1,
    "feedback": 2,
    "mt_pp": 2,
    "nav_menu_item": 14,
    "page": 10,
    "post": 73
  },
  "preferred_status_counts": {
    "inherit": 111,
    "publish": 80,
    "trash": 17,
    "draft": 5
  },
  "possible_duplicate_groups": 31,
  "content_files": {
    "posts": 73,
    "pages": 10
  }
}
```
