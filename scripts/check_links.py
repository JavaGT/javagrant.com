#!/usr/bin/env python3
"""
Check all external (http/https) links in every HTML/MD file under docs/ for reachability.

Run from the repo root:
    python3 scripts/check_links.py

Reports broken (non-2xx/3xx) links and connection errors. Exits non-zero if any are found.
Local root-relative links (e.g. /assets/...) are resolved against docs/ and checked for file existence.
"""
from html.parser import HTMLParser
import os
import re
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urlparse, quote
from urllib.request import Request, urlopen
from urllib.error import URLError, HTTPError
from http.client import InvalidURL

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOCS = os.path.join(ROOT, 'docs')
TIMEOUT = 15
UA = 'Mozilla/5.0 (compatible; javagrant-link-checker/1.0)'
EXTENSIONS = ('.html', '.htm', '.md')

# Hosts that block automated requests with non-2xx codes that aren't real breakage.
# Checked with a HEAD-less GET; treated as "skip" rather than broken.
BOT_BLOCK_HOSTS = {
    'www.linkedin.com', 'linkedin.com',
    'www.researchgate.net', 'researchgate.net',
    'www.instagram.com', 'instagram.com',
}

def iter_files():
    for dirpath, _, files in os.walk(DOCS):
        if os.path.sep + 'Bookbinder_files' in dirpath:
            continue
        for f in files:
            if f.endswith(EXTENSIONS):
                yield os.path.join(dirpath, f)

class LinkCollector(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links = []
    def handle_starttag(self, tag, attrs):
        if tag.lower() == 'a':
            for k, v in attrs:
                if k == 'href' and v:
                    self.links.append(v)

MD_LINK_RE = re.compile(r'\]\(([^)"\s]+)(?:\s+"[^"]*")?\)')

def collect_links(path):
    with open(path, 'r', encoding='utf-8', errors='replace') as f:
        text = f.read()
    links = set()
    if path.endswith('.md'):
        links.update(MD_LINK_RE.findall(text))
    else:
        p = LinkCollector()
        p.feed(text)
        links.update(p.links)
    result = []
    for href in links:
        href = href.split('#')[0].strip()
        if not href or href.startswith(('mailto:', 'javascript:', 'data:', 'signal:')):
            continue
        result.append(href)
    return result

def check_external(url):
    # sanitize control chars / spaces in the path/query/fragment
    try:
        p = urlparse(url)
        host = p.netloc.lower()
        safe = p._replace(path=quote(p.path, safe='/%'), query=quote(p.query, safe='=&?')).geturl()
    except ValueError as e:
        return url, None, f'malformed url: {e}'
    if host in BOT_BLOCK_HOSTS:
        return url, 'SKIP', f'bot-blocked host ({host})'
    try:
        req = Request(safe, headers={'User-Agent': UA})
        with urlopen(req, timeout=TIMEOUT) as r:
            status = r.status
            return url, status, None
    except HTTPError as e:
        return url, e.code, None
    except (URLError, TimeoutError, ConnectionError, InvalidURL, ValueError) as e:
        return url, None, str(e)

def check_local(href):
    # root-relative
    rel = href.lstrip('/')
    local = os.path.join(DOCS, rel)
    if os.path.isdir(local):
        local = os.path.join(local, 'index.html')
    if os.path.exists(local):
        return href, 200, None
    return href, None, 'local file not found'

def main():
    # gather unique external links + local links with their source files
    external = set()
    local_links = []
    for path in iter_files():
        for href in collect_links(path):
            if href.startswith('http'):
                external.add(href)
            elif href.startswith('/'):
                local_links.append(href)
            # relative links ignored — bookbinder/tracery have their own internal refs

    local_links = sorted(set(local_links))
    external = sorted(external)

    print(f'Checking {len(local_links)} local + {len(external)} external links...')

    broken = []
    # local
    for href in local_links:
        _, status, err = check_local(href)
        if err:
            broken.append(('LOCAL', href, status, err))

    # external (parallel)
    skipped = 0
    with ThreadPoolExecutor(max_workers=10) as ex:
        futures = {ex.submit(check_external, url): url for url in external}
        for fut in as_completed(futures):
            url, status, err = fut.result()
            if status == 'SKIP':
                skipped += 1
                continue
            if status is None or status >= 400:
                broken.append(('EXTERNAL', url, status, err))

    if not broken:
        print(f'OK — all {len(local_links) + len(external) - skipped} checked links resolve ({skipped} bot-blocked hosts skipped).')
        sys.exit(0)

    print('\nBroken links:')
    for kind, url, status, err in broken:
        s = status if status is not None else 'ERR'
        print(f'  [{kind}] {s} {url}' + (f' ({err})' if err else ''))
    print(f'\n{len(broken)} broken link(s).')
    sys.exit(1)

if __name__ == '__main__':
    main()
