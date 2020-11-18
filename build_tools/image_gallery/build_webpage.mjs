import { promises as fs } from "fs";
import pug from "pug";
import { fileURLToPath } from "url";
import path from "path";

const render = pug.compileFile(
  path.join(path.dirname(fileURLToPath(import.meta.url)), "template.pug")
);

// const render = pug.compileFile('./template.pug')
export default async function generateHTML(tree, root) {
    const css = (await fs.readFile(
      path.join(path.dirname(fileURLToPath(import.meta.url)), "style.css")
    )).toString()
  const html = render({root, tree, css});
  return html;
}
