import toTree from "@javagt/array-to-tree";
import pug from "pug";
import path from "path";
import gulp from "gulp";
import { processImages } from "./build_tools/image_gallery/process_images.mjs";
import renderGalleries from "./build_tools/image_gallery/render_galleries.mjs";
import sass from "gulp-sass";
const { series, watch, parallel, src, dest } = gulp;
import opts from "./options.mjs";
import { promises as fs } from "fs";

import readBlogs from './build_tools/blogs/read_blogs.mjs'

async function processPhotos() {
  // icons
  await processImages("_photography", opts.paths.photography_thumbs, {
    target_filesize: "100kb",
    width: 800,
  });
  // full-size
  await processImages("_photography", opts.paths.photography_fulls, {
    target_filesize: "3MB",
  });
}
async function processArt() {
  // icons
  await processImages("_art", opts.paths.art_thumbs, {
    target_filesize: "100kb",
    width: 800,
  });
  // full-size
  await processImages("_art", opts.paths.art_fulls, {
    target_filesize: "3MB",
  });
}


function photographyPages() {
  const renderGalleryPage = pug.compileFile(
    "./build_tools/templates/photography_page.pug"
  );
  return renderGalleries("_photography", path.join("docs", "photography"), {
    root: "photography",
    title: "Photography",
    renderGalleryPage,
    generateThumbRoute: (file) => [
      "static",
      "photography",
      "small",
      ...file.route,
    ],
    generateLargeRoute: (file) => [
      "static",
      "photography",
      "large",
      ...file.route,
    ],
  });
}
function artPages() {
  const renderGalleryPage = pug.compileFile(
    "./build_tools/templates/art_page.pug"
  );
  return renderGalleries("_art", path.join("docs", "art"), {
    root: "art",
    title: 'Art',
    renderGalleryPage,
    generateThumbRoute: (file) => [
      "static",
      "art",
      "small",
      ...file.route,
    ],
    generateLargeRoute: (file) => [
      "static",
      "art",
      "large",
      ...file.route,
    ],
  });
}


function styles() {
  return src("./styles/**/*.scss").pipe(sass()).pipe(dest("./docs/static"));
}

function cname() {
  return fs.writeFile(opts.cname.location, opts.cname.value);
}

async function blogs(){
  const renderBlog = pug.compileFile('./build_tools/templates/blog.pug')
  const in_directory = 'blogs'
  const out_directory = 'docs/blog';
  const entries = await readBlogs(in_directory)
  await Promise.all(entries.map(async entry=>{
    const slug = entry.data.slug || entry.data.title || path.parse(entry.route).name
    const parent_dir = path.join(out_directory, slug);
    await fs.mkdir(parent_dir, {recursive: true})
    const table_of_contents = (()=>{
      if (entry.data.table_of_contents) {
        const results = entry.content.match(/(#+) ([^\n]+)/g)
        const split = results.map(string=>string.split('#'))
        let str = '<div id="table-of-contents"><h2>Table of Contents</h2>'
        const list = `${split.reduce((prev_depth, next)=>{
          let inset = false
          let outset = false
          if (prev_depth < next.length) inset = true
          if (prev_depth > next.length) outset = true
          str += `${outset ? "</ul>" : ""}${
            inset ? "<ul>" : ""
          }<li><a href="#${next.join("").trim().toLowerCase().replace(/\s+/g, '-')}">${next
            .join("")
            .trim()}</a></li>`;
          return next.length
        }, 0)}`
        return str + '</ul></div>'
      }
      return ``
    })()
    const html = renderBlog({config: entry.data, content:entry.markdown_html, table_of_contents})
    await fs.writeFile(path.join(parent_dir, 'index.html'), html)
  }))

  const renderIndex = pug.compileFile('./build_tools/templates/index.pug')
  const index_html = renderIndex({blogs: entries})
  await fs.writeFile(path.join('docs', "index.html"), index_html);
}

async function watcher() {
  watch("./styles/**/*", styles);
  watch("./build_tools/templates/**/*", parallel(blogs, photographyPages, artPages))
  watch(
    [
      "./_photography/**/*",
      "./build_tools/image_gallery/style.css",
      "./build_tools/image_gallery/template.pug",
    ],
    parallel(processPhotos, photographyPages)
  );
  watch(
    [
      "./_art/**/*",
      "./build_tools/image_gallery/style.css",
      "./build_tools/image_gallery/template.pug",
    ],
    parallel(processArt, artPages)
  );
  watch("./blogs/**/*", blogs);
}

const photos = parallel(processPhotos, photographyPages);
const art = parallel(processArt, artPages);

export { watcher as watch };

export default parallel(photos, art, styles, cname, blogs);