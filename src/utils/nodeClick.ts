import { processData } from "./dataProcessor";
import { reload, setNodeStyles } from "../utils/cytoscapeHelper";

// @ts-ignore
const nodeFiles = files;
// @ts-ignore
const nodeConnections = connections;

// SETUP
let nodes = processData(nodeFiles, nodeConnections);

export const runNodeClick = (cy: any, cyRelative: any, depth: number = 1) => {
  // CLICK NODE EVENT
  cy.on("click", "node", function (event: any) {
    const id = event.target.id();

    const path = nodes[id].data.fullPath;

    // update style of clicked node
    setNodeStyles(cy, undefined, event.target);

    // change relative graph
    let relativeNodes = processData(nodeFiles, nodeConnections, depth, path);
    cyRelative.elements().remove();
    cyRelative.add(relativeNodes);

    setNodeStyles(cyRelative, undefined, cyRelative.nodes()[0]);

    reload(cyRelative, "reload");

    openFile(path);
  });
};

// Ability to open file on click
const openFile = (file: string) => {
  // @ts-ignore
  vscode.postMessage({
    command: "openFile",
    text: file,
  });
};
