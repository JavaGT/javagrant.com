import path from "path";
import { promises as fs } from "fs";
import MarkdownIt from "markdown-it";
import headinganchor from "markdown-it-headinganchor";
import globby from "globby";
import frontmatter from 'frontmatter'

const markdown = new MarkdownIt({ html: true });
markdown.use(headinganchor, {
  anchorClass: "",
  addHeadingAnchor: false,
  slugify: function (str, md) {
    return str.replace(/\s+/g, "-").toLowerCase();
  },
});

export default async function(in_directory){
  const glob = path.join(in_directory, '**/*.md')
  const routes = await globby(glob)

  const blogs = await Promise.all(
    routes.map(async (route) => {
      const file_contents = (await fs.readFile(route)).toString();

      const {content, data} = frontmatter(file_contents)

      const markdown_html = markdown.render(content)

      return {markdown_html, content, route, data}
    })
  );
  
  return blogs
}