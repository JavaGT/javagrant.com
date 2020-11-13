import slugify from '@sindresorhus/slugify'
import {promises as fs} from "fs";
import yaml from "js-yaml";
import path from "path";
import globby from 'globby'

const image_exts = ["jpg", "jpeg", "png"]
  .map((x) => [x.toUpperCase(), x.toLowerCase()])
  .flat();

async function globList(input_directory, ext){
  return globby(
    `${input_directory.split(path.sep).join(path.posix.sep)}/**/*.${ext}`
  );
}

async function generateStructure(input_directory){
  const info_routes = await globList(input_directory, 'yaml')
  const image_routes = await globList(
    input_directory,
    `(${image_exts.join("|")})`
  )

  const structure = []
  await addInfo(structure, info_routes, {
    processPath: (p) => path.relative(input_directory, p),
  });
  await addImages(structure, image_routes, {
    processPath: (p) => {
      return path.relative(input_directory, p)}
      ,
  });
  return {structure, info_routes, image_routes}
}


async function addInfo(structure, info, {processPath}){
  const info_map = await info.reduce(async (promise, route) => {
    const obj = await promise;
    const key = processPath(route)
    obj[key] = yaml.safeLoad((await fs.readFile(route)).toString());
    addSlug(obj[key], route.split(path.sep).slice(-2,-1))
    return obj;
  }, {});

  Object.entries(info_map).forEach(([route, content])=>{
    route.split(path.sep).reduce((build, step, index, full)=>{
      if (index < full.length-1) {
        if (!build[step]) build[step] = []
        return build[step]
      } else {
        build['.'] = content
        return build
      }
    }, structure)
  })
  return structure;
}

function addImages(structure, images, {processPath}){
  images.forEach(route=>
    processPath(route).split(path.sep)
      .reduce((obj, step, index, full)=>{
        if (index < full.length - 1) {
          if (!obj[step]) obj[step] = []
          return obj[step]
        } else {
          obj.push(full.join(path.sep))
        }
    }, structure)
  )
  return structure
}

function addSlug(obj, slug){
if (!obj.slug) {
  obj.slug = slugify(obj.title || obj.name || slug)
}
}

export default generateStructure
export {globList, image_exts}
