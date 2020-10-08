import dirTree from "directory-tree";
import del from "del";
import gulp from "gulp";
import markdown from "gulp-markdown";
import pug from "gulp-pug";
import pugEngine from "pug";
import through2 from "through2";
import sass from "gulp-sass";
import child_process from "child_process";
import util from "util";
const execp = util.promisify(child_process.exec);
const { watch, src, dest, series, parallel } = gulp;

function clean() {
  return del([
    "./docs/**/*",
    "!./docs/static",
    "!./docs/CNAME",
    "!./docs/static/**/*",
  ]);
}

const renderBlogPost = pugEngine.compileFile(
  "./src/views/components/blog_post.pug"
);

function createBlogPosts() {
  return src("./src/blog/**/*.md", { root: "." })
    .pipe(
      through2.obj((file, _, cb) => {
        let fileAsString = file.contents.toString();
        const matches = fileAsString.match(/^(#+).(.+)/gm);
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

        fileAsString = fileAsString.replace(
          /(#+ Table of Contents)/i,
          "$1\n" + toc
        );

        file.contents = Buffer.from(fileAsString);
        cb(null, file);
      })
    )
    .pipe(markdown())
    .pipe(
      through2.obj((file, _, cb) => {
        file.extname = ".html";
        const post = file.contents.toString();
        const title = file.relative.replace(file.extname, "");
        file.contents = Buffer.from(renderBlogPost({ post, title }));
        cb(null, file);
      })
    )
    .pipe(dest("./docs/blog"));
}

function views() {
  const data = {
    photographyDirectoryTree: dirTree("./docs/static/photography/icon", {
      extensions: /\.(jpg|jpeg|png|webp)$/,
    }),
    postDirectoryTree: dirTree("./src/blog", {
      extensions: /\.(md)$/,
    }),
  };
  return src(["./src/views/**/*.pug", "!./src/views/components/*.pug"], {
    root: ".",
  })
    .pipe(
      pug({
        data,
      })
    )
    .pipe(dest("./docs"));
}

function styles() {
  return src("./src/styles/**/*.scss").pipe(sass()).pipe(dest("./docs"));
}

function watcher() {
  watch("./src/styles/**/*", styles);
  watch("./src/views/**/*", views);
  watch("./src/blog/**/*", views);
  watch("./src/blog/**/*", createBlogPosts);
}

function photos() {
  const files = flattenDirectoryStructure(
    dirTree("./_photography", {
      extensions: /\.(jpg|jpeg|png|webp)$/,
    })
  ).filter((file) => file.path);
  return Promise.all(files.map(imageConvertCommand).map((a) => execp(a)));
}

function imageConvertCommand(file) {
  const dirPath = `./docs/static/${file.path
    .replace(file.name, "")
    .replace("_", "")}`;
  const iconPath = dirPath.replace("photography", "photography/icon");
  const imagePath = dirPath.replace("photography", "photography/image");
  return `mkdir -p "${iconPath}" && convert -define jpeg:extent=256kb -resize 900x "./${file.path}" "${iconPath}/${file.name}" && mkdir -p "${imagePath}" && convert -define jpeg:extent=3Mb "./${file.path}" "${imagePath}/${file.name}"`;
}

function flattenDirectoryStructure(structure) {
  const directories = structure.children.filter((x) => x.type === "directory");
  const files = structure.children.filter((x) => x.type === "file");
  const dirFiles = directories.map((dir) => flattenDirectoryStructure(dir));
  const allFiles = [...files, ...dirFiles].flat();
  return allFiles;
}

const build = series(clean, parallel(views, styles, createBlogPosts));

export { watcher as watch, build, photos };
export default series(clean, parallel(views, styles, createBlogPosts));
