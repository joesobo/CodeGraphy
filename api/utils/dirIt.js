import fs from "fs";
import path from "path";

const files = [];
const dirs = [];

export const dirIt = (directory) => {
  try {
    let dirContent = fs.readdirSync(directory);

    dirContent.forEach((dirPath) => {
      const fullPath = path.join(directory, dirPath);

      if (fs.statSync(fullPath).isFile()) files.push(fullPath);
      else dirs.push(fullPath);
    });

    if (dirs.length !== 0) dirIt(dirs.pop());

    return files;
  } catch (ex) {
    console.log(ex);
    return false;
  }
};
