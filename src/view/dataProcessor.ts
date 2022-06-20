import { containsWhiteListExtension } from "../utils/whitelistHelper";

export const processData = (files: string[], connections: any) => {
  let nodes: any[] = [];

  // push root nodes
  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    if (containsWhiteListExtension(file)) {
      const filePath = file.replace(/\\/g, "/");
      const fileName = filePath.split("/").pop() || "";
      nodes.push({
        group: "nodes",
        data: {
          id: index,
          label: fileName,
          fullPath: file,
        },
      });
    }
  }

  // push edges
  connections.forEach((connectionSet: any[]) => {
    connectionSet.forEach((connection) => {
      nodes.push(connection);
    });
  });

  return nodes;
};
