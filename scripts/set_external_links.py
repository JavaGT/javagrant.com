#!/usr/bin/env python3
"""
Add target="_blank" and rel="noopener noreferrer" to external links in docs/index.html.
Skips links pointing to the site's origin (javagrant.com) and localhost.
"""
from html.parser import HTMLParser
from html import unescape
import sys

INFILE = 'docs/index.html'
OUTFILE = INFILE + '.tmp'

class LinkFixer(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.out = []

    def handle_starttag(self, tag, attrs):
        if tag.lower() == 'a':
            attrs_dict = dict(attrs)
            href = attrs_dict.get('href','')
            if href.startswith('http'):
                try:
                    from urllib.parse import urlparse
                    p = urlparse(href)
                    origin = p.netloc
                    # skip same-origin links
                    if origin and not (origin.endswith('javagrant.com') or origin.startswith('localhost')):
                        # ensure target and rel
                        if 'target' not in attrs_dict:
                            attrs.append(('target','_blank'))
                        rel = attrs_dict.get('rel','')
                        if 'noopener' not in rel:
                            # preserve existing rel if any
                            newrel = (rel + ' ' + 'noopener noreferrer').strip()
                            # remove old rel tuple if exists
                            attrs = [a for a in attrs if a[0] != 'rel']
                            attrs.append(('rel', newrel))
                except Exception:
                    pass
        # rebuild start tag
        s = ['<', tag]
        for k,v in attrs:
            if v is None:
                s.append(' ' + k)
            else:
                s.append(' %s="%s"' % (k, unescape(v)))
        s.append('>')
        self.out.append(''.join(s))

    def handle_endtag(self, tag):
        self.out.append(f'</{tag}>')

    def handle_data(self, data):
        self.out.append(data)

    def handle_comment(self, data):
        self.out.append('<!--' + data + '-->')

    def handle_entityref(self, name):
        self.out.append('&%s;' % name)

    def handle_charref(self, name):
        self.out.append('&#%s;' % name)


with open(INFILE,'r',encoding='utf-8') as f:
    html = f.read()

p = LinkFixer()
p.feed(html)
with open(OUTFILE,'w',encoding='utf-8') as f:
    f.write(''.join(p.out))

# Replace original
import os
os.replace(OUTFILE, INFILE)
print('Updated', INFILE)
