import {
  removeWhiteListExtension,
  containsWhiteListExtension,
} from "./whitelistFiles.js";

export const processData = async (files) => {
  let nodes = [];

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
  connections.forEach((connectionSet) => {
    connectionSet.forEach((connection) => {
      nodes.push(connection);
    });
  });

  return nodes;
};
