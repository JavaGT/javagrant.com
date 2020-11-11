import path from "path";
import opts from "../options.mjs";
import build_gallery from './build_gallery.mjs'

const config = {
  in_folder: './_photography',
  lastrun_location: './_photography/lastrun.txt',
  preview_out_folder: path.join(
    opts.photo_folder_out,
    opts.preview_image_folder
  ),
  full_out_folder: path.join(
    opts.photo_folder_out,
    opts.full_image_folder
  ),
}

export default function(){
  return build_gallery(config)
}