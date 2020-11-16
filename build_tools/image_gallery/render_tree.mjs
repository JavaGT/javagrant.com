import path from "path";
import { promises as fs } from "fs";

export default async function renderTree(tree, output_route, render) {
  if (tree.route) {
    const route = path.join(output_route, ...tree.route, "index.html");
    const html = await render(tree);
    await fs.mkdir(path.dirname(route), { recursive: true });
    await fs.writeFile(route, html);
  }
  if (tree.children)
    return Promise.all(
      Object.values(tree.children)
        .filter((child) => child.type == "directory")
        .map((tree) => renderTree(tree, output_route, render))
    );
  return;
}