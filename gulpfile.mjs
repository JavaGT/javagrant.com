import path from 'path'
import gulp from 'gulp'
import fs from 'fs/promises'
import pug from 'pug'
import frontmatter from 'frontmatter'
import markdown from './util/markdown.mjs'
import gwebserver from 'gulp-webserver'
const { watch, parallel, series } = gulp

const source_directory = relpath('source')
const output_directory = relpath('docs')
const MARKDOWN_PUG_TEMPLATE_FILE = path.join(process.cwd(), 'source', 'template', 'markdown.pug')

function relpath(...crumbs) {
    return path.join(process.cwd(), ...crumbs)
}

function copy(input_path, output_path) {
    return gulp.src(path.join(input_path)).pipe(gulp.dest(output_path))
}

async function buildPug(input_path, output_path, options) {
    const renderTemplate = pug.compileFile(input_path)
    const html = renderTemplate(options)
    return fs.writeFile(output_path, html)
}

async function buildMarkdown(input_path, output_path) {
    const file_content = (await fs.readFile(input_path)).toString()
    const { content, data } = frontmatter(file_content)
    const rendered = markdown.render(content)
    return buildPug(MARKDOWN_PUG_TEMPLATE_FILE, output_path, { ...data, content: rendered })
}

async function buildPage(input_path, output_path) {
    const info = path.parse(input_path)
    const output_folder = path.join(output_path)
    const file_output_path = path.join(output_folder, 'index.html')
    await fs.mkdir(output_folder, { recursive: true })

    if (info.ext === '.md') {
        return buildMarkdown(input_path, file_output_path)
    } else if (info.ext === '.pug') {
        return buildPug(input_path, file_output_path)
    }
}

async function buildPages(input_path, output_path) {
    await fs.mkdir(output_path, { recursive: true })
    const files = await fs.readdir(input_path, { withFileTypes: true })
    return files.reduce(async (prev, file) => {
        await prev
        const name = path.parse(file.name).name
        const filepath = path.join(input_path, file.name)
        const filepath_output = path.join(output_path, (name !== 'index' ? name : ''))
        if (file.isDirectory()) {
            await buildPages(filepath, filepath_output)
        } else {
            return buildPage(filepath, filepath_output)
        }
    }, Promise.resolve())
}

export async function build() {
    await copy(path.join(source_directory, 'static', '**', '*'), path.join(output_directory, 'static'))
    await copy('./source/favicon.png', output_directory)
    await copy('./source/CNAME', output_directory)
    await buildPages(path.join(source_directory, 'pages'), path.join(output_directory))
    await buildPage(path.join(source_directory, 'index.pug'), path.join(output_directory))
}

function webserver() {
    gulp.src(output_directory)
        .pipe(gwebserver({
            livereload: true,
            open: true,
        }));
};

export default () => {
    build();
    webserver();
    watch([source_directory + '/**/*'], build);
}