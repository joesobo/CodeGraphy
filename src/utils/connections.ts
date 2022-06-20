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
    source: number;
    target: number;
  };
};

export type Connections = Connection[];

export const findConnections = async (
  files: string[],
  startIndex: number
): Promise<Connections> => {
  let connections: Connection[] = [];

  const file = files[startIndex];
  const lineReader = readline.createInterface({
    input: fs.createReadStream(file),
  });

  for await (const line of lineReader) {
    const lineArr = line.split(" ");
    const temp = lineArr[lineArr.length - 1].split("/");
    const last = removeWhiteListExtension(
      temp[temp.length - 1]
        .replace(";", "")
        .replace('"', "")
        .replace("'", "")
        .replace('"', "")
    );

    if (line.startsWith("import") && line.includes("from")) {
      const lastIndex = indexOfNode(files, last);
      if (lastIndex != -1) {
        connections.push({
          group: "edges",
          data: {
            id: startIndex + "-" + lastIndex,
            source: startIndex,
            target: lastIndex,
          },
        });
      }
    }
  }

  return connections;
};

const indexOfNode = (files: string[], edgeNode: string) => {
  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    const extensionlessFile = file.split("/");
    const directFileName = removeWhiteListExtension(
      extensionlessFile[extensionlessFile.length - 1]
    );

    if (directFileName === edgeNode) {
      return index;
    }
  }

  return -1;
};

export const getConnections = async (files: string[]) => {
  let connections = [];
  for (let index = 0; index < files.length; index++) {
    const result = await findConnections(files, index);
    if (result.length > 0) {
      connections.push(result);
    }
  }
  return connections;
};
