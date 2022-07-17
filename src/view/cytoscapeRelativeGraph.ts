import { processData } from "../utils/dataProcessor";
import { styles, reload } from "../utils/cytoscapeHelper";
import { canUseLabels } from "../utils/nodeLabels";
import { sortingOption } from "../utils/nodeSort";
import { getNewCytoscape } from "../utils/cytoscapeGraphCreator";

// EXTERNAL IMPORTS
// @ts-ignore
const nodeFiles = files;
// @ts-ignore
const nodeConnections = connections;
// @ts-ignore
const nodeCurrentFile = currentFile;

// SETUP
let nodes = processData(nodeFiles, nodeConnections, 1, nodeCurrentFile);

var cy = getNewCytoscape(nodes, styles(canUseLabels), "cy-relative");

const localDepth = document?.getElementById("local-depth") as HTMLInputElement;

localDepth.onchange = () => {
  const depthValue = parseInt(localDepth.value);
  nodes = processData(nodeFiles, nodeConnections, depthValue, nodeCurrentFile);

  cy.elements().remove();
  cy.add(nodes);
  reload(cy, sortingOption);
};
