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

document?.getElementById("reload")?.addEventListener("click", function () {
  if (!layout) {
    layout = cy.layout({
      name: "cose",
      animate: "end",
      animationEasing: "ease-out",
      animationDuration: 1000,
    } as any);
  }
  layout.run();
});

document?.getElementById("cose-button")?.addEventListener("click", function () {
  layout = cy.layout({
    name: "cose",
    animate: "end",
    animationEasing: "ease-out",
    animationDuration: 1000,
  } as any);

  layout.run();
});

document
  ?.getElementById("fcose-button")
  ?.addEventListener("click", function () {
    layout = cy.layout({
      name: "fcose",
      animationEasing: "ease-out",
      animationDuration: 1000,
      randomize: false,
    } as any);

    layout.run();
  });

document
  ?.getElementById("cose-bilkent-button")
  ?.addEventListener("click", function () {
    layout = cy.layout({
      name: "cose-bilkent",
      animationEasing: "ease-out",
      animationDuration: 1000,
    } as any);

    layout.run();
  });

document?.getElementById("cola-button")?.addEventListener("click", function () {
  layout = cy.layout({
    name: "cola",
    infinite: true,
    animate: true,
    animationEasing: "ease-out",
    animationDuration: 1000,
  } as any);

  layout.run();
});

document?.getElementById("grid-button")?.addEventListener("click", function () {
  layout = cy.layout({
    name: "grid",
    animate: true,
    animationEasing: "ease-out",
    animationDuration: 1000,
  });

  layout.run();
});

document
  ?.getElementById("random-button")
  ?.addEventListener("click", function () {
    layout = cy.layout({
      name: "random",
      animate: true,
      animationEasing: "ease-out",
      animationDuration: 1000,
    });

    layout.run();
  });

document
  ?.getElementById("circle-button")
  ?.addEventListener("click", function () {
    layout = cy.layout({
      name: "circle",
      animate: true,
      animationEasing: "ease-out",
      animationDuration: 1000,
    });

    layout.run();
  });

document
  ?.getElementById("concentric-button")
  ?.addEventListener("click", function () {
    layout = cy.layout({
      name: "concentric",
      animate: true,
      animationEasing: "ease-out",
      animationDuration: 1000,
    });

    layout.run();
  });

document
  ?.getElementById("breadthfirst-button")
  ?.addEventListener("click", function () {
    layout = cy.layout({
      name: "breadthfirst",
      animate: true,
      animationEasing: "ease-out",
      animationDuration: 1000,
    });

    layout.run();
  });
