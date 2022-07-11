import cytoscape from "cytoscape";
import { processData } from "../utils/dataProcessor";
import { styles, reload } from "../utils/cytoscapeHelper";
import { runNodeHover } from "../utils/nodeHover";
import { runNodeClick } from "../utils/nodeClick";
import { canUseLabels, runNodeLabels } from "../utils/nodeLabels";
import { sortingOption, runNodeSort } from "../utils/nodeSort";

// @ts-ignore
import cypopper from "cytoscape-popper";
// @ts-ignore
import coseBilkent from "cytoscape-cose-bilkent";
// @ts-ignore
import fcose from "cytoscape-fcose";
// @ts-ignore
import cola from "cytoscape-cola";

cytoscape.use(cypopper);
cytoscape.use(coseBilkent);
cytoscape.use(fcose);
cytoscape.use(cola);

// EXTERNAL IMPORTS
// @ts-ignore
const nodeFiles = files;
// @ts-ignore
const nodeConnections = connections;

// SETUP
let nodes = processData(nodeFiles, nodeConnections);

// console.log(nodeFiles);
// console.log(nodeConnections);
// console.log(nodes);

// CYTOSCAPE SETUP
var cy = cytoscape({
  container: document.getElementById("cy"),
  elements: nodes,
  style: styles(canUseLabels),
  layout: {
    name: "cose",
  },
  ready: function () {
    this.layout({
      name: "cose",
      animate: "end",
      animationEasing: "ease-out",
      animationDuration: 1000,
    }).run();
  },

  // initial viewport state:
  zoom: 1,
  pan: { x: 0, y: 0 },

  // interaction options:
  minZoom: 1 / 2,
  maxZoom: 2,
  zoomingEnabled: true,
  userZoomingEnabled: true,
  panningEnabled: true,
  userPanningEnabled: true,
  boxSelectionEnabled: true,
  selectionType: "single",
  touchTapThreshold: 8,
  desktopTapThreshold: 4,
  autolock: false,
  autoungrabify: false,
  autounselectify: false,

  // rendering options:
  headless: false,
  styleEnabled: true,
  hideEdgesOnViewport: false,
  textureOnViewport: false,
  motionBlur: false,
  motionBlurOpacity: 0.2,
  pixelRatio: "auto",
} as any);

// RELOAD EVENT LISTENERS
document?.getElementById("reload")?.addEventListener("click", function () {
  reload(cy, sortingOption);
});

runNodeHover(cy);
runNodeClick(cy);
runNodeLabels(cy);
runNodeSort(cy);
