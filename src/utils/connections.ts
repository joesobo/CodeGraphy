import readline from "readline";
import fs from "fs";

export type Connection = {
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
  const start = startTemp[startTemp.length - 1].replace(".js", "");
  const lineReader = readline.createInterface({
    input: fs.createReadStream(file),
  });

  for await (const line of lineReader) {
    const lineArr = line.split(" ");
    const first = lineArr[0];
    const temp = lineArr[lineArr.length - 1].split("/");
    const last = temp[temp.length - 1].replace(";", "").replace('"', "");

    if (first === "import") {
      connections.push({
        data: {
          id: start + "-" + last,
          source: start,
          target: last,
        },
      });
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
