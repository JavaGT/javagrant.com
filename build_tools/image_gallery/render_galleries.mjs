import toTree from "@javagt/array-to-tree";
import path from "path";
import globby from "globby";
import renderTree from "./render_tree.mjs";
import generateHTML from "./build_webpage.mjs";

export default async function renderGalleries(
  input_route,
  output_route,
  { root, title, renderGalleryPage, generateThumbRoute, generateLargeRoute }
) {
  const glob = path.join(input_route, "**/*.(jpg|JPG|jpeg|JPEG|png|PNG)");
  // make routes relative to root dir provided
  const all_routes = (await globby(glob)).map((p) => {
    return path.relative(input_route, p).split(path.sep);
  });
  const tree = toTree(all_routes, {
    processFile: (file) =>
      Object.assign(file, {
        thumb_route: generateThumbRoute(file),
        large_route: generateLargeRoute(file),
      }),
  });
  return renderTree(tree, output_route, async (childtree) =>
    renderGalleryPage({
      config: { title },
      gallery: await generateHTML(childtree, root),
    })
  );
}
