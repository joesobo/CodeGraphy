import { setWindowSize } from "./windowHelper";

let layout: any;
let lastLayout = "cose";

// CYTOSCAPE GRAPH STYLES
export const styles = (canUseLabels: boolean) => [
  {
    selector: "node",
    style: {
      shape: "heptagon",
      "background-color": "#4a4a4c",
      label: canUseLabels ? "data(label)" : "",
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
    selector: ".selectedNode",
    style: {
      shape: "circle",
      "background-color": "#fff",
      label: canUseLabels ? "data(label)" : "",
    },
  },
  {
    selector: "label",
    style: {
      color: "#d4d4d4",
      // @ts-ignore
      fontSize: 12,
    },
  },
];

// REFRESH LAYOUT
export const reload = (cy: any, layoutOption: string) => {
  if (layout) {
    layout.stop();
  }

  setLayout(cy, layoutOption);

  layout.run();
};

// LAYOUT SETUP
const setLayout = (cy: any, layoutName: string) => {
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

// WINDOW SIZE SETUP
setWindowSize();

// NEEDED FOR POPOVERS
// @ts-ignore
window.process = {
  env: {
    NODE_ENV: "development",
  },
};
