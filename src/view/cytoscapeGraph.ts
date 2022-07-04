import { processData } from "./dataProcessor";
import { setWindowSize } from "../utils/windowHelper";
import cytoscape from "cytoscape";

// @ts-ignore
import coseBilkent from "../build/cytoscape-cose-bilkent";
// @ts-ignore
import fcose from "../build/cytoscape-fcose";
// @ts-ignore
import cola from "../build/cytoscape-cola";

cytoscape.use(coseBilkent);
cytoscape.use(fcose);
cytoscape.use(cola);

// IMPORTS
// @ts-ignore
const nodeFiles = files;
// @ts-ignore
const nodeConnections = connections;

let nodes = processData(nodeFiles, nodeConnections);

// SETUP
let layout: any;
let lastLayout = "cose";

// CYTOSCAPE SETUP
var cy = cytoscape({
  container: document.getElementById("cy"),
  elements: nodes,
  style: [
    {
      selector: "node",
      style: {
        shape: "heptagon",
        "background-color": "#4a4a4c",
        label: "data(label)",
      },
    },
    {
      selector: "edge",
      style: {
        width: 2,
        "line-color": "#d4d4d4",
        "target-arrow-color": "#d4d4d4",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier",
      },
    },
    {
      selector: "label",
      style: {
        color: "#d4d4d4",
      },
    },
  ],
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

// LAYOUT SETUP
const setLayout = (layoutName: string) => {
  if (layoutName === "reload") {
    setWindowSize();
  } else {
    lastLayout = layoutName;
  }

  layout = cy.layout({
    name: layoutName === "reload" ? lastLayout : layoutName,
    animate: "end",
    animationEasing: "ease-out",
    animationDuration: 1000,
    randomize: false,
    infinite: true,
  } as any);
};

// BUTTON EVENT LISTENERS
const select = document.getElementById("sorting-options") as HTMLSelectElement;
let sortingOption = select.options[select.selectedIndex].value;

select.onchange = () => {
  sortingOption = select.options[select.selectedIndex].value;
  reload(sortingOption);
};

// RELOAD EVENT LISTENERS
document?.getElementById("reload")?.addEventListener("click", function () {
  reload(sortingOption);
});

// WINDOW SIZE SETUP
setWindowSize();

cy.on("click", "node", function (evt) {
  const id = evt.target.id();
  //   console.log(nodes[id].data);

  const path = nodes[id].data.fullPath;

  // @ts-ignore
  openFile(path);
});

const reload = (layoutOption: string) => {
  if (layout) {
    layout.stop();
  }

  setLayout(layoutOption);

  layout.run();
};
