import MarkdownIt from "markdown-it";
import gulp from "gulp";
import mkdirp from "mkdirp";
import fs from "fs";
import pug from "pug";
import path from "path";
import util from "util";
import sass from "gulp-sass";
import yaml from "yaml";
import opts from "./options.mjs";
import headinganchor from "markdown-it-headinganchor";
import glob from "fast-glob";
import child_process from "child_process";
const execp = util.promisify(child_process.exec);

const fsp = fs.promises;
const { series, watch, parallel, src, dest } = gulp;
const markdown = new MarkdownIt({ html: true });
markdown.use(headinganchor, {
  anchorClass: "",
  addHeadingAnchor: false,
  slugify: function (str, md) {
    return str.replace(/\s+/g, "-").toLowerCase();
  },
});

async function clearBlogs(out_path) {
  await mkdirp(out_path);
  const filenames = (await fsp.readdir(out_path)).filter((x) =>
    x.includes(".html")
  );
  return Promise.all(
    filenames.map((filename) => {
      const file_path = path.join(out_path, filename);
      return fsp.unlink(file_path);
    })
  );
}

async function readBlogs(directory) {
  const filenames = (await fsp.readdir(directory)).filter((x) =>
    x.includes(".md")
  );
  const blogs = Promise.all(
    filenames.map(async (filename) => {
      const file_path = path.join(directory, filename);
      const file_contents = (await fsp.readFile(file_path)).toString();
      return { file_path, file_contents };
    })
  );
  return blogs;
}

async function parseBlogs(blogs) {
  return Promise.all(
    blogs.map(({ file_contents, file_path }) => {
      const fragments = file_contents.split("---").filter((x) => x);
      const config = yaml.parse(fragments[0]);

      let content = fragments.slice(1).join("---");
      const matches = content.match(/^(#+).(.+)/gm);

      if (matches) {
        const toc = matches
          .map((entry, index) => {
            const indent =
              entry
                .split("")
                .reduce(
                  (previous, current) =>
                    current == "#" ? previous + 1 : previous,
                  0
                ) - 1;
            return `${" ".repeat(indent * 2)} - [${entry
              .replace(/#/g, "")
              .trim()}](#${entry
              .replace(/#/g, "")
              .trim()
              .replace(/\s/g, "-")
              .toLowerCase()})`;
          })
          .join("\n");
        content = content.replace(/(#+ Table of Contents)/i, "$1\n" + toc);
        if (content.includes("# Table of Contents"))
          config.tableofcontents = true;
      }

      const rendered = markdown.render(content);
      config.file_path = file_path;
      return { config, rendered };
    })
  );
}

async function blogs() {
  const blogTemplate = pug.compileFile(opts.blog_template);
  await clearBlogs(opts.rendered_blogs_path);
  const blogs = await readBlogs(opts.blogs_path);
  const parsedBlogs = await parseBlogs(blogs);
  return Promise.all(
    parsedBlogs.map((blog) => {
      const rendered = blogTemplate({
        content: blog.rendered,
        config: blog.config,
      });
      const out_path = path.join(
        opts.rendered_blogs_path,
        blog.config.slug + ".html"
      );
      return fsp.writeFile(out_path, rendered);
    })
  );
}

async function index() {
  const blogs = await readBlogs(opts.blogs_path);
  const parsedBlogs = await parseBlogs(blogs);
  const indexTemplate = pug.compileFile(opts.index_template);
  const rendered = indexTemplate({
    config: {
      title: "Java Grant",
      description: "A blog, resume and art by Java Grant",
    },
    blogs: parsedBlogs,
  });
  const out_path = path.join(opts.root_output, "index.html");
  return await fsp.writeFile(out_path, rendered);
}

function styles() {
  return src("./styles/**/*.scss").pipe(sass()).pipe(dest("./docs/static"));
}

async function cname() {
  return fsp.writeFile(opts.cname_location, opts.cname);
}

async function processImages({ glob_in, out_path }) {
  const input_files = await glob(glob_in);
  return input_files.reduce(async (previous, file_path) => {
    await previous;
    const output_path = file_path.split(path.sep).slice(2).join(path.sep);
    const route = output_path.split(path.sep).slice(0, -1).join(path.sep);
    await mkdirp(path.join("./", out_path, "small", route));
    await mkdirp(path.join("./", out_path, "large", route));
    const small_cmd = `convert -define jpeg:extent=256kb -resize 900x "${file_path}" "${path.join(
      "./",
      out_path,
      "small",
      output_path
    )}"`;
    const large_cmd = `convert -define jpeg:extent=3Mb "${file_path}" "${path.join(
      "./",
      out_path,
      "large",
      output_path
    )}"`;
    await execp(small_cmd);
    return await execp(large_cmd);
  });
}

async function processPhotos() {
  await processImages({
    glob_in: "./_photography/**/*.(jpg|png|JPG|PNG)",
    out_path: opts.photo_folder,
  });
}
async function processArt() {
  await processImages({
    glob_in: "./_art/**/*.(jpg|png|JPG|PNG)",
    out_path: opts.art_folder,
  });
}

async function photographyStructure() {
  return await folderStructure({
    in_glob: "./docs/photos/small/**/*.(jpg|png|JPG|PNG)",
    base_dir: "./docs/photos/small/",
    replace_base: "/photos/small",
  });
}

async function artStructure() {
  return await folderStructure({
    in_glob: "./docs/art/small/**/*.(jpg|png|JPG|PNG)",
    base_dir: "./docs/art/small/",
    replace_base: "/art/small",
  });
}

async function folderStructure({ in_glob, base_dir, replace_base }) {
  const build = {};
  const files = (await glob(in_glob))
    .map((file) =>
      file
        .replace(base_dir, "")
        .split(path.sep)
        .filter((x) => x)
    )
    .forEach((route) => {
      const filename = route.pop();
      let pos = build;
      route.forEach((step) => {
        if (!pos[step]) pos[step] = {};
        pos = pos[step];
      });
      if (!pos[filename])
        pos[filename] = [replace_base, ...route, filename].join("/");
    });
  return build;
}

async function imagegridPage({ structure, title, description, output_name }) {
  const imagegridTemplate = pug.compileFile(opts.imagegrid_template);
  const rendered = imagegridTemplate({
    config: {
      title,
      description,
    },
    structure,
  });
  const out_path = output_name;
  return await fsp.writeFile(out_path, rendered);
}

async function photographyPage() {
  const structure = await photographyStructure();
  return await imagegridPage({
    structure,
    title: "Java Grant - Photography",
    description: "Photography by Java Grant",
    output_name: path.join(opts.photo_folder, "index.html"),
  });
}
async function artPage() {
  const structure = await artStructure();
  return await imagegridPage({
    structure,
    title: "Java Grant - Art",
    description: "Art by Java Grant",
    output_name: path.join(opts.art_folder, "index.html"),
  });
}

const photos = series(processPhotos, photographyPage);
const art = series(processArt, artPage);

async function watcher() {
  watch("./styles/**/*", styles);
  watch(["./blogs/**/*", "./templates/**/*"], blogs);
  watch("./templates/**/*", index);
  watch("./templates/**/*", photographyPage);
  watch("./templates/**/*", artPage);
}
export { photos, art, watcher as watch };
export default parallel(blogs, index, styles, cname);
