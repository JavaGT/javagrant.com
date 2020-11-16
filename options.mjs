import path from 'path'

const paths = {}

paths.photography_images = path.join("docs", "static", "photography");
paths.photography_thumbs = path.join(paths.photography_images, "small");
paths.photography_fulls = path.join(paths.photography_images, "large");

paths.art_images = path.join("docs", "static", "art");
paths.art_thumbs = path.join(paths.art_images, "small");
paths.art_fulls = path.join(paths.art_images, "large");


const cname = {}
  cname.location= path.join('docs', 'cname')
  cname.value= "javagrant.com"

export default { paths, cname }