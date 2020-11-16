import child_process from "child_process";
import util from "util";
import del from 'del'
import path from 'path'
import globby from "globby";
import { promises as fs } from "fs";

const execp = util.promisify(child_process.exec);

export { processImages };

async function processImages(incoming_route, existing_route, { target_filesize, width, suffix }) {
  const previous_runtime = await getPreviousRuntime(existing_route).catch(
    (_) => 0
  );
  const incoming = await getImages(incoming_route);
  const existing = await getImages(existing_route);
  const relative_incoming = incoming.map((p) =>
    path.relative(incoming_route, p)
  );
  const relative_existing = existing.map((p) =>
    path.relative(existing_route, p)
  );
  const relative_fresh = getFreshImages(relative_incoming, relative_existing);
  const relative_updated = (await getUpdatedImages(incoming)).map((p) =>
    path.relative(incoming_route, p)
  );
  const relative_removed = getRemovedImages(
    relative_incoming,
    relative_existing
  );

  const to_process = [...relative_fresh, ...relative_updated];
  const commands = to_process.map(route=>generateCommand(route, {incoming_route, existing_route, target_filesize, width}));
  await deleteImages(relative_removed.map((p) => path.join(existing_route, p)));
  
  // Make folders
  await Promise.all(
    [...new Set(
      relative_fresh.map(p=>path.dirname(path.join(existing_route, p)))
    )]
    .map((p) => fs.mkdir(p, {recursive: true})))
  // Run convert commands
  await commands.reduce(async (previous, next)=>{
    await previous
    return execp(next)
  }, {})

  await setPreviousRuntime(existing_route)
  return { relative_routes: relative_incoming };
}

async function getPreviousRuntime(route) {
  return parseInt(
    (await fs.readFile(path.join(route, ".previous_runtime"))).toString()
  );
}
async function setPreviousRuntime(route) { 
  await fs.writeFile(path.join(route, ".previous_runtime"), Date.now().toString())
}

async function getImages(route) {
  const glob =
    route.split(path.sep).join(path.posix.sep) +
    "/**/*.(jpg|jpeg|png|JPG|JPEG|PNG)";
  return globby(glob);
}

function getFreshImages(relative_incoming, relative_existing) {
  return relative_incoming.filter(
    (route) => !relative_existing.includes(route)
  );
}

async function getUpdatedImages(incoming, previous_runtime) {
  return incoming.reduce(async (previous, route) => {
    await previous[previous.length - 1];
    if ((await fs.stat(route)).ctime < previous_runtime) {
      previous.push(route);
    }
    return previous;
  }, []);
}

function getRemovedImages(relative_incoming, relative_existing) {
  return relative_existing.filter(
    (route) => !relative_incoming.includes(route)
  );
}

function generateCommand(route, {incoming_route, existing_route, target_filesize, width}) {
  const incoming_file_route = path.join(incoming_route, route);
  const existing_file_route = path.join(existing_route, route);
  return `convert -define jpeg:extent=${target_filesize} ${
    width ? `-resize ${width}x` : ""
  } "${incoming_file_route}" "${existing_file_route}"`
}

function deleteImages(routes){
  return del(routes)
}