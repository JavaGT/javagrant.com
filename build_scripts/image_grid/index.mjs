import { fileURLToPath } from "url";
import { promises as fs } from "fs";
import photoStructure, {
  globList,
  image_exts,
} from "./lib/photo-directory-structure.mjs";
import path from "path";
import del from "del";
import pug from "pug";
import generateCommands from "./lib/generateCommands.mjs";
import util from "util";
import { exec } from "child_process";
const execp = util.promisify(exec); 
const render = pug.compileFile(path.join(path.dirname(fileURLToPath(import.meta.url)), "template.pug"));
const css = (await fs.readFile(path.join(path.dirname(fileURLToPath(import.meta.url)), "gallery.css"))).toString()

async function compareRouteLists(in_routes, out_routes, lastruntime) {
  const new_routes = in_routes.filter((x) => !out_routes.includes(x));
  const old_routes = in_routes.filter((x) => out_routes.includes(x));
  const removed_routes = out_routes.filter((x) => !in_routes.includes(x));
  const changed_routes = (
    await Promise.all(
      old_routes.map(async (route) => {
        const ctime = (await fs.stat(path.join("_photography", route))).ctime;
        return ctime > lastruntime ? route : undefined;
      })
    )
  ).filter((x) => x);

  return {
    in_routes,
    out_routes,
    new_routes,
    old_routes,
    removed_routes,
    changed_routes,
  };
}

export default async function processDirectory({
  input_dir,
  output_dir,
  target_filesize,
  timestamp_filename,
  width,
}) {
  const { structure, image_routes } = await photoStructure(input_dir);

  const lastruntime = parseInt(
    await fs.readFile(timestamp_filename).catch((_) => 0)
  );

  const in_routes = image_routes.map((route) =>
    path.relative(input_dir, route)
  );
  const out_routes = (
    await globList(output_dir, `(${image_exts.join("|")})`)
  ).map((route) => path.relative(output_dir, route));
  const {
    new_routes,
    changed_routes,
    removed_routes,
  } = await compareRouteLists(in_routes, out_routes, lastruntime);

  console.log(
    `${new_routes.length} new | ${changed_routes.length} changed  | ${removed_routes.length} removed`
  );
  console.log(in_routes, out_routes);

  await del(removed_routes.map((x) => `${output_dir}${x}`));
  const commands = generateCommands([...changed_routes, ...new_routes], {
    in_directory: input_dir,
    out_directory: output_dir,
    target_filesize,
    width,
  });

  await [...new Set(in_routes.map((route) => path.dirname(route)))].reduce(
    async (prev, route) => {
      await prev;
      return fs.mkdir(path.join(output_dir, route), { recursive: true });
    },
    Promise.resolve()
  );

  await commands.reduce(async (prev, next) => {
    await prev;
    return execp(next);
  }, Promise.resolve());

  await fs.writeFile(timestamp_filename, Date.now().toString());
  return { structure, in_routes };
}

export {render, css}
