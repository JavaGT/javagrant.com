import MarkdownIt from "markdown-it";
import anchor from "markdown-it-anchor";
import toc from 'markdown-it-toc-done-right'
import spans from 'markdown-it-bracketed-spans'
import attrs from 'markdown-it-attrs'
import mila from 'markdown-it-link-attributes'

// MarkdownIt is used to read md files
const markdown = new MarkdownIt({ html: true });
markdown.use(anchor, { slugify });
markdown.use(toc)
markdown.use(spans)
markdown.use(attrs)
markdown.use(mila, {
    pattern: /^https?:/,
    attrs: {
        target: '_blank',
        rel: 'noopener'
    }
})

function slugify(string) {
    return string.replace(/\s+/g, "-").toLowerCase()
}

export default markdown