# javagrant.com

Personal website deployed via GitHub Pages from `docs/`.

## Structure

```
docs/              — GitHub Pages root (published site)
  index.html       — main CV-as-Wikipedia-page
  style.css        — site styles
  CNAME            — custom domain config
  assets/          — images, gifs, pdfs
  contact/         — contact page
  desires/         — wishlist / book list
  library/         — audiobook library
  notes/           — assorted notes
  phd-research/    — PhD research info & participate page
  tools/           — web tools (bookbinder, tracery, etc.)
drafts/            — unpublished blog posts & recommendations (markdown)
scripts/           — utility scripts
  set_external_links.py
  main.js          — vowel-detection benchmark
```

## Deploy

Push to `master`. GitHub Pages serves `docs/` at https://javagrant.com.

## Local preview

Root-absolute paths (`/style.css`, `/assets/...`) only resolve when served from a
root, not via `file://`. Run from the repo root:

```bash
python3 -m http.server --directory docs 8000
# open http://localhost:8000/
```

## Checks before push

- **External links:** `python3 scripts/check_links.py` — verifies every `http(s)`
  link in `docs/` is reachable (exits non-zero on breakage; skips bot-blocking
  hosts like LinkedIn/ResearchGate).
- **External-link attributes:** `python3 scripts/set_external_links.py` — adds
  `target="_blank"` and `rel="noopener noreferrer"` to external links in
  `docs/index.html`.
