import readline from "readline";
import fs from "fs";

export const findConnections = async (
  file: any,
  currentPath: string,
  currentDir: string
) => {
  let connections = [];
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
