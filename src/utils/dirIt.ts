import fs from "fs";
import path from "path";
import { containsWhiteListExtension } from "../view/whitelistFiles";

const files: string[] = [];
const dirs: string[] = [];

// returns a full list of files in a dir and its subdirs
// ignores any files in the node_modules dir or is not a whitelisted extension
export const dirIt = (directory: any) => {
  try {
    let dirContent = fs.readdirSync(directory);

    dirContent.forEach((dirPath) => {
      const fullPath = path.join(directory, dirPath);

      if (!fullPath.includes("node_modules")) {
        if (fs.statSync(fullPath).isFile()) {
          if (containsWhiteListExtension(fullPath)) {
            files.push(fullPath);
          }
        } else {
          dirs.push(fullPath);
        }
      }
    });

    if (dirs.length !== 0) dirIt(dirs.pop());

    return files;
  } catch (ex) {
    console.log(ex);
    return [];
  }
};
