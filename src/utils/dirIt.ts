import fs from "fs";
import path from "path";

const files: string[] = [];
const dirs: string[] = [];

export const dirIt = (directory: string) => {
  try {
    let dirContent = fs.readdirSync(directory);

    dirContent.forEach((dirPath: string) => {
      const fullPath = path.join(directory, dirPath);

      if (fs.statSync(fullPath).isFile()) files.push(fullPath);
      else dirs.push(fullPath);
    });

    if (dirs.length !== 0) dirIt(dirs.pop() as string);

    return files;
  } catch (ex) {
    console.log(ex);
    return false;
  }
};
