import { join, parse } from 'path'
import fs from 'fs/promises'
import gulp from 'gulp'
import pug from 'pug'
import frontmatter from 'frontmatter'
import markdown from './util/markdown.mjs'

const { watch } = gulp

const output_directory = join(process.cwd(), 'docs')

function relpath(...crumbs) {
    return join(process.cwd(), ...crumbs)
}

async function readpaths(path) {
    return (await fs.readdir(path)).map(name => join(path, name))
}

const options = { config: {} }

function indexPage(options = {}) {
    const input_path = relpath('source', 'index.pug')
    const output_path = join(output_directory, 'index.html')
    return renderPage({ input_path, output_path, options })
}
function renderPage({ input_path, output_path, options }) {
    const renderTemplate = pug.compileFile(input_path)
    const html = renderTemplate(options)
    return fs.writeFile(output_path, html)
}

function onlyPaths(type) {
    return function(path){
        return parse(path).ext === type
    }
}

async function build(){
    await indexPage()
    const pages_path = relpath('source', 'pages')
    const all_pages = await readpaths(pages_path)
    // const pug_pages = all_pages.filter(onlyPaths('.pug'))
    // const md_pages = all_pages.filter(onlyPaths('.md'))

    all_pages.map(async input_path => {
        const info = parse(input_path)
        const output_folder = join(output_directory, info.name)
        const output_path = join(output_folder, 'index.html')
        await fs.mkdir(output_folder, { recursive: true })
        if (info.ext === '.md') {
            
            const file_content = (await fs.readFile(input_path)).toString()
            const {content, data} = frontmatter(file_content)
            const rendered = markdown.render(content)
            return renderPage({ input_path: join(process.cwd(), 'source', 'template', 'markdown.pug'), output_path, options: {...data, content: rendered} })
            return fs.writeFile(output_path, rendered)
        } else if (info.ext === '.pug') {
            return renderPage({ input_path, output_path, options })
        }
    })

    return gulp.src('./source/static/**/*')
        .pipe(gulp.dest('./docs/static'));
}

// async function googleDoc({output_path, input_url}){
//     const url = input_url
//     //'https://docs.google.com/document/d/1XIArxJB87pKG2w0PU7H4KiLXkc7DCY1w_ttZjZhmpsQ/export?format=html'
//     const html = await fetch(url).then(res=>res.text())
//     const output_directory = output_path
//     await fs.mkdir(output_directory, { recursive: true })
//     await fs.writeFile(output_path, html)
// }

export default ()=>watch(['./source/**/*'], build);