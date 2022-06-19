import { processData } from "./dataProcessor.js";
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

// @ts-ignore
const nodeFiles = files;
// @ts-ignore
const nodeConnections = connections;

let nodes = processData(nodeFiles, nodeConnections);

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

let layout: any;
let lastLayout = "cose";

const buttonNames = [
  "reload",
  "cose",
  "fcose",
  "cose-bilkent",
  "cola",
  "grid",
  "random",
  "circle",
  "concentric",
  "breadthfirst",
];

buttonNames.forEach((buttonName) => {
  document
    ?.getElementById(buttonName + "-button")
    ?.addEventListener("click", function () {
      if (layout) {
        layout.stop();
      }

      setLayout(buttonName);

      layout.run();
    });
});

const setLayout = (layoutName: string) => {
  layout = cy.layout({
    name: layoutName === "reload" ? lastLayout : layoutName,
    animate: "end",
    animationEasing: "ease-out",
    animationDuration: 1000,
    randomize: false,
    infinite: true,
  } as any);

  lastLayout = layoutName === "reload" ? lastLayout : layoutName;
};
