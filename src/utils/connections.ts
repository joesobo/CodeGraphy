import readline from "readline";
import fs from "fs";
import {
  containsWhiteListExtension,
  removeWhiteListExtension,
} from "./whitelistHelper";

export type Connection = {
  group: string;
  data: {
    id: string;
    source: string;
    target: string;
  };
};

export type Connections = Connection[];

export const findConnections = async (
  file: string,
  currentPath: string,
  currentDir: string
): Promise<Connections> => {
  let connections: Connection[] = [];
  const removeDir = currentPath.replace(currentDir, "").substring(1);
  const startConnection = file.replace(/\\/g, "/").replace(removeDir, "");
  const startTemp = startConnection.split("/");
  const start = removeWhiteListExtension(startTemp[startTemp.length - 1]);
  const lineReader = readline.createInterface({
    input: fs.createReadStream(file),
  });

  for await (const line of lineReader) {
    const lineArr = line.split(" ");
    const temp = lineArr[lineArr.length - 1].split("/");
    const last = temp[temp.length - 1]
      .replace(";", "")
      .replace('"', "")
      .replace("'", "");

    if (containsWhiteListExtension(last)) {
      if (line.startsWith("import") && line.includes("from")) {
        connections.push({
          group: "edges",
          data: {
            id: start + "-" + removeWhiteListExtension(last),
            source: start,
            target: removeWhiteListExtension(last),
          },
        });
      }
    }
  }

  return connections;
};

export const getConnections = async (
  files: string[],
  currentPath: string,
  currentDir: string
) => {
  let connections = [];
  for (const file of files) {
    const result = await findConnections(file, currentPath, currentDir);
    if (result.length > 0) {
      connections.push(result);
    }
  }
  return connections;
};
