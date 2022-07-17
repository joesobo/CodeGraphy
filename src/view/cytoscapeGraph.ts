import { processData } from "../utils/dataProcessor";
import { styles, reload } from "../utils/cytoscapeHelper";
import { runNodeHover } from "../utils/nodeHover";
import { runNodeClick } from "../utils/nodeClick";
import { canUseLabels, runNodeLabels } from "../utils/nodeLabels";
import { sortingOption, runNodeSort } from "../utils/nodeSort";
import { getNewCytoscape } from "../utils/cytoscapeGraphCreator";

// EXTERNAL IMPORTS
// @ts-ignore
const nodeFiles = files;
// @ts-ignore
const nodeConnections = connections;

// SETUP
let nodes = processData(nodeFiles, nodeConnections);

export let cy = getNewCytoscape(nodes, styles(canUseLabels), "cy");

// RELOAD EVENT LISTENERS
document?.getElementById("reload")?.addEventListener("click", function () {
  reload(cy, sortingOption);
});

runNodeHover(cy);
runNodeClick(cy);
runNodeLabels(cy);
runNodeSort(cy);
