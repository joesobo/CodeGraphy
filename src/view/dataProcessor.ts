import {
  removeWhiteListExtension,
  containsWhiteListExtension,
} from "./whitelistFiles";

export const processData = async (files: string[], connections: any) => {
  let nodes: any[] = [];

  // push root nodes
  files.forEach((file) => {
    if (containsWhiteListExtension(file)) {
      const filePath = file.replace(/\\/g, "/");
      const fileName = filePath.split("/").pop() || "";
      nodes.push({
        data: {
          id: removeWhiteListExtension(fileName),
          label: fileName,
        },
      });
    }
  });

  // push edges
  connections.forEach((connectionSet: any[]) => {
    connectionSet.forEach((connection) => {
      nodes.push(connection);
    });
  });

  return nodes;
};
