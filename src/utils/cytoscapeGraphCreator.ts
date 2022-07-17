import cytoscape from "cytoscape";

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

export const getNewCytoscape = (
  nodes: any[],
  nodeStyles: any,
  elementID: string
) =>
  cytoscape({
    container: document.getElementById(elementID),
    elements: nodes,
    style: nodeStyles,
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
