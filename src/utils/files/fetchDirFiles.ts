import fs from "fs";
import path from "path";
import {
  containsWhitelistDir,
  containsWhiteListExtension,
} from "./whitelistHelper";
import {
  containsBlacklistDir,
  containsBlackListExtension,
} from "./blacklistHelper";

let files: string[] = [];
let dirs: string[] = [];

// returns a full list of files in a dir and its subdirs
// ignores any files in the node_modules dir or is not a whitelisted extension
export const fetchDirFiles = (
  directory: any,
  whitelistSettings: string[],
  clear?: boolean
) => {
  if (clear) {
    files = [];
    dirs = [];
  }

  try {
    let dirContent = fs.readdirSync(directory);

    dirContent.forEach((dirPath) => {
      const fullPath = path.join(directory, dirPath);

      if (containsWhitelistDir(fullPath) && !containsBlacklistDir(fullPath)) {
        if (fs.statSync(fullPath).isFile()) {
          if (
            containsWhiteListExtension(fullPath, whitelistSettings) &&
            !containsBlackListExtension(fullPath)
          ) {
            files.push(fullPath);
          }
        } else {
          dirs.push(fullPath);
        }
      }
    });

    if (dirs.length !== 0) {
      fetchDirFiles(dirs.pop(), whitelistSettings, false);
    }

    return files;
  } catch (ex) {
    console.log(ex);
    return [];
  }
};
