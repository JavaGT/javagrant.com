import fsp from 'fs/promises'
import path from 'path'
import markdownIt from 'markdown-it'
import YAML from 'yaml'
import mdAnchor from 'markdown-it-anchor'
import mdTocDoneRight from 'markdown-it-toc-done-right'

// check when source/data/boardgames.csv was last updated
// const boardgames_last_updated = await fsp.stat(os_path('./source/data/boardgames.csv')).then(stat => stat.mtime)
// if it was less then 10 minutes ago, don't update it
// if (Date.now() - boardgames_last_updated < 10 * 60 * 1000) {
//     console.log('boardgames.csv was updated less than 10 minutes ago, skipping download')
// } else {
//     console.log('boardgames.csv was updated more than 10 minutes ago, downloading')
//     const response = await fetch('https://docs.google.com/spreadsheets/d/1VljHjImr2FCw4zAh6G60DbJJq4ktgEyc_pLLx0oCk18/gviz/tq?tqx=out:csv')
//     const data = await response.text()
//     await fsp.writeFile(os_path('./source/data/boardgames.csv'), data)
// }

const boardgames_csv = await fsp.readFile(os_path('./source/data/boardgames.csv'), 'utf-8')
const boardgames_strings = [...new Set(boardgames_csv.split('\n'))].filter(Boolean)
const boardgames_header = boardgames_strings.shift().split(',')
const boardgames_html =
    '<table><thead><tr><th>Game</th><th>Players</th><th>Time (min)</th><th>Year</th></tr></thead><tbody>' +
    boardgames_strings
        .map(row => {
            return row.split('","').reduce((acc, value, i) => {
                value = value.replaceAll('"', '')
                if (value.startsWith('"') && value.endsWith('"')) {
                    acc[boardgames_header[i]] = value.slice(1, -1)
                } else {
                    acc[boardgames_header[i]] = value
                }
                return acc
            }, {})
        })
        // remove duplicates using objectid property
        .filter((game, i, self) => self.findIndex(t => t.objectid === game.objectid) === i)
        .map(game => {
            const time_string = game.minplaytime == game.maxplaytime ? game.minplaytime : `${game.minplaytime}-${game.maxplaytime}`
            const player_string = game.minplayers == game.maxplayers ? game.minplayers : `${game.minplayers}-${game.maxplayers}`
            return `<tr><td><a href="https://boardgamegeek.com/boardgame/${game.objectid}">${game.objectname}</a></td><td>${player_string}</td><td>${time_string}</td><td>${game.yearpublished}</td></tr>`
        })
        .join('\n')
    + '</tbody></table>'


const markdown = markdownIt({
    html: true,
    linkify: true,
    typographer: true,
})
    .use(mdAnchor, { permalink: true, permalinkBefore: true, permalinkSymbol: '🔗' })
    .use(mdTocDoneRight, {
        containerClass: 'toc',
        listClass: 'toc-list',
        itemClass: 'toc-item',
        linkClass: 'toc-link',
        // level: [2, 3],
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
const blog_template = await fsp.readFile(template_filepath, 'utf-8')


// clean output directory
await fsp.rm(output_directory, { recursive: true }).catch(() => { })

const files = await fsp.glob(path.join(source_directory, '**', '*.md'))

let blogs = []
for await (const file of files) {
    const file_content = await fsp.readFile(file, 'utf-8')
    const { content, data } = parse_blog(file_content)
    blogs.push({ title: data.title, date: data.date, data, content, word_count: content.split(/\s+/).length })
}

blogs = blogs.filter(blog => blog?.data?.publish !== false)

blogs.sort((a, b) => new Date(b.data.date) - new Date(a.data.date))

const blogs_string = blogs.map(blog =>
    `< li > <a href="/blog/${blog.data.slug}">${blog.title}</a> - <span>${blog.date}</span></li > `
).join('\n')

const blogs_table_string =
    '<table><tbody>'
    // '<table><thead><tr><th>Post Title</th><th>Date</th></tr></thead><tbody>'
    + blogs.map(blog =>
        `< tr ><td><a href="/blog/${blog.data.slug}">${blog?.data?.emoji || '📝'} ${blog.title}</a></td><td>${blog.date}</td><td><progress class="rating" value="${blog?.data?.rating || 0}" max="10"> ${blog?.data?.rating || 0}/10 </progress></td><td>${(blog.word_count / 238).toFixed(1)} mins</td></tr > `
    ).join('\n') + '</tbody></table>'


const root_string = await fsp.readFile(os_path('./source/template/root.html'), 'utf-8')
function render_root(content_html, title = "Java Grant") {
    return root_string
        .replaceAll('{{page}}', content_html)
        .replaceAll('{{blogs}}', blogs_string)
        .replaceAll('{{title}}', title)
}

for (const file of blogs) {
    file.blogs = blogs
    const output_folder = path.join(output_directory, file.data.slug)
    await fsp.mkdir(output_folder, { recursive: true })
    const file_output_path = path.join(output_folder, 'index.html')
    file.html = blog_template
        .replaceAll('{{content}}', file.content)
        .replaceAll('{{title}}', file.data.title)
        .replaceAll('{{date}}', file.data.date)
        .replaceAll('{{blogs}}', blogs_string)
        .replaceAll('[[]]', '') // the table of contents plugin leaves this in the output for some reason
    await fsp.writeFile(file_output_path, render_root(file.html, file.data.title))
}

const blog_index_template_filepath = os_path('./source/template/blog-index.html')
const blog_index_template = await fsp.readFile(blog_index_template_filepath, 'utf-8')
const blog_index_output_path = os_path('./docs/blog/index.html')
const blog_index_html = blog_index_template
    .replaceAll('{{blogs_table}}', blogs_table_string)
await fsp.writeFile(blog_index_output_path, render_root(blog_index_html, "Java Grant - Blog"))

// render index page
const index_template_filepath = os_path('./source/template/index.html')
const index_template = await fsp.readFile(index_template_filepath, 'utf-8')
const index_output_path = os_path('./docs/index.html')
const index_html = index_template.replaceAll('{{blogs_table}}', blogs_table_string)
await fsp.writeFile(index_output_path, render_root(index_html, "Java Grant"))


// loop over /source/pages and render them
const pages_directory = os_path('./source/pages')
const pages_output_directory = os_path('./docs')
const pages_files = await fsp.glob(path.join(pages_directory, '**', '*.md'))

for await (const file of pages_files) {
    const file_content = await fsp.readFile(file, 'utf-8')
    const { content, data } = parse_blog(file_content)
    const output_folder = path.join(pages_output_directory, data.slug)
    await fsp.mkdir(output_folder, { recursive: true })
    const file_output_path = path.join(output_folder, 'index.html')
    const file_html = blog_template
        .replaceAll('{{content}}', content)
        .replaceAll('{{title}}', data?.title || '')
        .replaceAll('{{date}}', data?.date || '')
        .replaceAll('{{blogs}}', blogs_string || '')
        .replaceAll('[[]]', '') // the table of contents plugin leaves this in the output for some reason
        .replaceAll('{{boardgames}}', boardgames_html)
    await fsp.writeFile(file_output_path, render_root(file_html, data.title))
}


// todo generate RSS feed
// todo generate tag page
// todo generate author pages
