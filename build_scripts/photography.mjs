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
import {imagesToProcess, createConvertCommands, makeDirectories, runCommands} from "./util.mjs";

const execp = util.promisify(child_process.exec);
const fsp = fs.promises;

const lastrun = JSON.parse(await fsp.readFile('./lastrun.json').catch(_=>0))

async function photos(){
  const output_preview = path.join(opts.photo_folder_out, opts.preview_image_folder)
  const output_full = path.join(opts.photo_folder_out, opts.full_image_folder)

  const files = await imagesToProcess({
    incoming: opts.photo_folder_in,
    existing: output_preview,
  });
  const files_to_remove = files.removed.map(file=>[path.join(output_preview, file),path.join(output_full, file)]).flat()
  const files_to_process = [...files.new, ...files.modified];
  const output_directories = files_to_process
    .map((p) => [
      path.join(output_preview, path.dirname(p)),
      path.join(output_full, path.dirname(p)),
    ])
    .flat();
  
  const preview_commands = createConvertCommands(files_to_process, {
    input_folder: opts.photo_folder_in,
    output_folder: output_preview,
    filesize: "256kb",
    width: 900,
  });
  const full_commands = createConvertCommands(files_to_process, {
    input_folder: opts.photo_folder_in,
    output_folder: output_full,
    filesize: "3Mb",
  });

  await del(files_to_remove);
  await makeDirectories(output_directories)
  await runCommands([...full_commands, ...preview_commands])
  await fsp.writeFile("./lastrun.json", Date.now().toString());
}

export default photos