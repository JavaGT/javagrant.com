import fsp from 'fs/promises'
import path from 'path'
import markdownIt from 'markdown-it'
import YAML from 'yaml'

const markdown = markdownIt({
    html: true,
    linkify: true,
    typographer: true,
})

function os_path(filepath) {
    // Normalize path to OS path
    return path.join(...filepath.split('/'))
}

function render_markdown(content) {
    // Render markdown content
    return markdown.render(content)
}


function parse_blog(content) {
    // Extract frontmatter from content
    const frontmatter_regex = /^---\n([\s\S]+?)\n---\n([\s\S]+)$/
    const match = content.match(frontmatter_regex)
    if (match) {
        const [, frontmatter, content] = match
        return { content: render_markdown(content), data: YAML.parse(frontmatter) }
    } else {
        return { content: render_markdown(content), data: {} }
    }
}

const source_directory = os_path('./source/blog')
const output_directory = os_path('./docs/blog')

const template_filepath = os_path('./source/template/blog.html')
const template = await fsp.readFile(template_filepath, 'utf-8')


// clean output directory
await fsp.rm(output_directory, { recursive: true }).catch(() => { })

const files = await fsp.glob(path.join(source_directory, '**', '*.md'))

const blogs = []
for await (const file of files) {
    const file_content = await fsp.readFile(file, 'utf-8')
    const { content, data } = parse_blog(file_content)
    const output_folder = path.join(output_directory, data.slug)
    const file_output_path = path.join(output_folder, 'index.html')
    await fsp.mkdir(output_folder, { recursive: true })
    const html = template
        .replaceAll('{{content}}', content)
        .replaceAll('{{title}}', data.title)
        .replaceAll('{{date}}', data.date)
    await fsp.writeFile(file_output_path, html)
    blogs.push({ title: data.title, date: data.date, path: file_output_path, data })
}

// todo generate index.html
const index_template_filepath = os_path('./source/template/blog-index.html')
const index_template = await fsp.readFile(index_template_filepath, 'utf-8')
const index_output_path = os_path('./docs/blog/index.html')
const index_html = index_template
    .replaceAll('{{blogs}}',
        blogs.map(blog =>
            `<li><a href="/blog/${blog.data.slug}">${blog.title}</a> - <span>${blog.date}</span></li>`
        ).join('\n'))
await fsp.writeFile(index_output_path, index_html)

// todo generate RSS feed
// todo generate tag page
// todo generate author pages
