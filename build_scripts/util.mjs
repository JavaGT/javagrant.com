import MarkdownIt from "markdown-it";
import gulp from "gulp";
import mkdirp from "mkdirp";
import fs from "fs";
import pug from "pug";
import del from "del";
import path from "path";
import util from "util";
import sass from "gulp-sass";
import yaml from "yaml";
import opts from "../options.mjs";
import headinganchor from "markdown-it-headinganchor";
import glob from "fast-glob";
import child_process, { exec } from "child_process";
const fsp = fs.promises;

const execp = util.promisify(child_process.exec);

export { imagesInFolder, imagesToProcess, createConvertCommands, runCommands, makeDirectories}

function makeDirectories(dirs){
  return Promise.all([...new Set(dirs)].map(dir=>mkdirp(dir)))
}

function runCommands(cmds){
  return cmds.reduce(async (previous, cmd)=>{
    await previous
    return execp(cmd)
  }, Promise.resolve())
}

function imagesInFolder(directory) {
  return glob(path.join(directory, "**", "*.(jpg|png|JPG|PNG)"));
}

async function imagesToProcess({ incoming, existing, previous_timestamp }) {
  const exist_imgs_full = await imagesInFolder(existing);
  const inc_imgs_full = await imagesInFolder(incoming);
  const exist_imgs_rel = exist_imgs_full.map((p) => path.relative(existing, p));
  const inc_imgs_rel = inc_imgs_full.map((p) => path.relative(incoming, p));

  const new_images = inc_imgs_rel.filter(
    (inc) => !exist_imgs_rel.includes(inc)
  );
  const removed_images = exist_imgs_rel.filter(
    (ex) => !inc_imgs_rel.includes(ex)
  );
  const modified_determined = await Promise.all(
    inc_imgs_full.map(async (p) => ({
      path: p,
      modified: (await fsp.stat(p)).mtime.getTime() > previous_timestamp,
    }))
  );
  const modified_images = modified_determined
    .filter((x) => x.modified)
    .map((x) => path.relative(incoming, x.path));

  return {
    all: inc_imgs_rel,
    new: new_images,
    removed: removed_images,
    modified: modified_images,
  };
}

function createConvertCommands(
  paths,
  { input_folder, output_folder, filesize, width }
) {
  return paths.map((p) => {
    return `convert -define jpeg:extent=${filesize} ${
      width ? `-resize ${width}x` : ""
    } "${path.join(input_folder, p)}" "${path.join(output_folder, p)}"`;
  });
}