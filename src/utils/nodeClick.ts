import { processData } from "./dataProcessor";

// @ts-ignore
const nodeFiles = files;
// @ts-ignore
const nodeConnections = connections;

// SETUP
let nodes = processData(nodeFiles, nodeConnections);

export const runNodeClick = (cy: any) => {
  // CLICK NODE EVENT
  cy.on("click", "node", function (event: any) {
    const id = event.target.id();

    const path = nodes[id].data.fullPath;

    // @ts-ignore
    openFile(path);
  });
};
