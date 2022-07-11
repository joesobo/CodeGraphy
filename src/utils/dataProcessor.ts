import { containsWhiteListExtension } from "./whitelistHelper";

export const processData = (
  files: string[],
  connections: any[],
  depth?: number,
  openFile?: any
) => {
  let nodes: any[] = [];
  let tempFiles: string[] = files;
  let tempConnections: any[] = connections;

  // local graph
  if (depth && openFile) {
    tempFiles = [openFile];
    tempConnections = [];

    let queue: any[] = [{ file: openFile, depth: 0 }];

    while (queue.length > 0) {
      const currentQueueElement = queue.shift();
      const currentIndex = findIndexInFiles(files, currentQueueElement.file);

      // search connections for input / output of current queue pop
      connections.forEach((connectionSet: any[]) => {
        const newConnectionSet: any[] = [];

        Array.from(connectionSet).forEach((connection) => {
          const source = parseInt(connection.data.source);
          const target = parseInt(connection.data.target);

          if (source === currentIndex || target === currentIndex) {
            let nonSelectedIndex = source;
            if (source === currentIndex) {
              nonSelectedIndex = target;
            }

            const nonSelectedFile = files[nonSelectedIndex];
            if (
              !tempFiles.includes(nonSelectedFile) &&
              currentQueueElement.depth < depth
            ) {
              // add file to temp files
              tempFiles.push(nonSelectedFile);

              const newSource = tempFiles.indexOf(files[source]);
              const newTarget = tempFiles.indexOf(files[target]);

              let newConnection = JSON.parse(JSON.stringify(connection));
              newConnection.data.id = `${newSource}-${newTarget}`;
              newConnection.data.source = newSource;
              newConnection.data.target = newTarget;

              newConnectionSet.push(newConnection);
              // add file to queue
              queue.push({
                file: nonSelectedFile,
                depth: currentQueueElement.depth + 1,
              });
            }
          }
        });

        // if found add connections to temp connects
        tempConnections.push(newConnectionSet);
      });
    }
  }

  // push root nodes
  for (let index = 0; index < tempFiles.length; index++) {
    const file = tempFiles[index];
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
  tempConnections.forEach((connectionSet: any[]) => {
    Array.from(connectionSet).forEach((connection) => {
      nodes.push(connection);
    });
  });

  return nodes;
};

const findIndexInFiles = (files: string[], testElement: string) => {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.includes(testElement)) {
      return i;
    }
  }

  return -1;
};
