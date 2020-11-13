import processDirectory, {
  render as renderGrid,
  css as galleryCss,
} from "./build_scripts/image_grid/index.mjs";
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
import photos from "./build_scripts/photography.mjs";
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

// async function photographyStructure() {
//   return await folderStructure({
//     in_glob: "./docs/photography/preview/**/*.(jpg|png|JPG|PNG)",
//     base_dir: "./docs/photography/preview/",
//     replace_base: "/photography/preview",
//   });
// }

// async function artStructure() {
//   return await folderStructure({
//     in_glob: "./docs/art/small/**/*.(jpg|png|JPG|PNG|gif|GIF)",
//     base_dir: "./docs/art/small/",
//     replace_base: "/art/small",
//   });
// }

// async function folderStructure({ in_glob, base_dir, replace_base }) {
//   const build = {};
//   const files = (await glob(in_glob))
//     .map((file) =>
//       file
//         .replace(base_dir, "")
//         .split(path.sep)
//         .filter((x) => x)
//     )
//     .forEach((route) => {
//       const filename = route.pop();
//       let pos = build;
//       route.forEach((step) => {
//         if (!pos[step]) pos[step] = {};
//         pos = pos[step];
//       });
//       if (!pos[filename])
//         pos[filename] = [replace_base, ...route, filename].join("/");
//     });
//   return build;
// }

// async function imagegridPage({ structure, title, description, output_name }) {
//   const imagegridTemplate = pug.compileFile(opts.imagegrid_template);
//   const rendered = imagegridTemplate({
//     config: {
//       title,
//       description,
//     },
//     structure,
//   });
//   const out_path = output_name;
//   return await fsp.writeFile(out_path, rendered);
// }

// async function photographyPage() {
//   const structure = await photographyStructure();
//   Object.entries(structure).map(([key, value]) => {
//     if (typeof value == "object") {
//       return;
//     }
//   });
//   return await imagegridPage({
//     structure,
//     title: "Java Grant - Photography",
//     description: "Photography by Java Grant",
//     output_name: path.join(opts.photo_folder_out, "index.html"),
//   });
// }
// async function artPage() {
//   const structure = await artStructure();
//   console.log(structure);
//   return await imagegridPage({
//     structure,
//     title: "Java Grant - Art",
//     description: "Art by Java Grant",
//     output_name: path.join(opts.art_folder, "index.html"),
//   });
// }

// async function delPhotos() {
//   return del(["./docs/photography/**/*", "!./docs/photography/index.html"]);
// }

// async function delArt() {
//   return del(["./docs/art/**/*", "!./docs/art/index.html"]);
// }

// const photosg = series(photos, photographyPage);
// const art = series(delArt, processArt, artPage);

// fs.writeFile(
//   "index.html",
//   render({
//     images: structure,
//     process: (route) => ({
//       preview: path.join("_out", route),
//       high_res: path.join("_out", route),
//     }),
//   })
// );

async function photographyGrid() {
  const { structure } = await processDirectory({
    input_dir: "_photography",
    output_dir: "docs/photography/preview",
    width: 400,
    target_filesize: "500kb",
    timestamp_filename: "docs/photography/preview/lastrun.txt",
  });
  await processDirectory({
    input_dir: "_photography",
    output_dir: "docs/photography/full",
    width: 900,
    target_filesize: "3MB",
    timestamp_filename: "docs/photography/full/lastrun.txt",
  });
  const content = renderGrid({
    images: structure,
    process: (route) => ({
      preview: path.join("preview", route),
      high_res: path.join("full", route),
    }),
  });
  const photographyTemplate = pug.compileFile(opts.imagegrid_template);
  await fsp.writeFile(
    "docs/photography/index.html",
    photographyTemplate({
      content,
      css: galleryCss,
      config: { title: "Java Grant Photography" },
    })
  );
}

async function artGrid() {
  const { structure } = await processDirectory({
    input_dir: "_art",
    output_dir: "docs/art/preview",
    width: 400,
    target_filesize: "500kb",
    timestamp_filename: "docs/art/preview/lastrun.txt",
  });
  await processDirectory({
    input_dir: "_art",
    output_dir: "docs/art/full",
    width: 900,
    target_filesize: "3MB",
    timestamp_filename: "docs/art/full/lastrun.txt",
  });
  const content = renderGrid({
    images: structure,
    process: (route) => ({
      preview: path.join("preview", route),
      high_res: path.join("full", route),
    }),
  });
  const photographyTemplate = pug.compileFile(opts.imagegrid_template);
  await fsp.writeFile(
    "docs/art/index.html",
    photographyTemplate({
      content,
      css: galleryCss,
      config: { title: "Java Grant Art" },
    })
  );
}

async function watcher() {
  watch("./styles/**/*", styles);
  watch(["./blogs/**/*", "./templates/**/*"], blogs);
  watch(["./blogs/**/*", "./templates/**/*"], index);
}
export { watcher as watch };
export default parallel(photographyGrid, artGrid, blogs, index, styles, cname); //photographyPage, artPage);
