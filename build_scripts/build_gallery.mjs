import del from "del";
import fs from "fs";
import path from "path";
import {
  imagesToProcess,
  createConvertCommands,
  makeDirectories,
  runCommands,
} from "./util.mjs";

const fsp = fs.promises;

export default async function main({in_folder, preview_out_folder, full_out_folder, lastrun_location}) {
  const lastrun = JSON.parse(
    await fsp.readFile(lastrun_location).catch((_) => 0)
  );
  
  const files = await imagesToProcess({
    incoming: in_folder,
    existing: preview_out_folder,
    previous_timestamp: lastrun
  });
  const files_to_remove = files.removed
    .map((file) => [
      path.join(preview_out_folder, file),
      path.join(full_out_folder, file),
    ])
    .flat();
  const files_to_process = [...files.new, ...files.modified];
  const output_directories = files_to_process
    .map((p) => [
      path.join(preview_out_folder, path.dirname(p)),
      path.join(full_out_folder, path.dirname(p)),
    ])
    .flat();

  const preview_commands = createConvertCommands(files_to_process, {
    input_folder: in_folder,
    output_folder: preview_out_folder,
    filesize: "256kb",
    width: 900,
  });
  const full_commands = createConvertCommands(files_to_process, {
    input_folder: in_folder,
    output_folder: full_out_folder,
    filesize: "3Mb",
  });

  await del(files_to_remove);
  await makeDirectories(output_directories);
  await runCommands([...full_commands, ...preview_commands]);
  await fsp.writeFile(lastrun_location, Date.now().toString());
}
