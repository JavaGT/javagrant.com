import path from "path";
export default function generateCommands(
  routes,
  { in_directory, out_directory, target_filesize, width }
) {
  return routes
    .filter((route) => ![".yaml"].includes(path.parse(route).ext.toLowerCase()))
    .map((route) => {
      const width_str = width ? `-resize ${width}x` : "";
      const filesize_str = `jpeg:extent=${target_filesize}`;
      const input_str = `"${path.join(in_directory, route)}"`;
      const output_str = `"${path.join(out_directory, route)}"`;
      return `convert -define ${filesize_str} ${width_str} ${input_str} ${output_str}`;
    });
}
