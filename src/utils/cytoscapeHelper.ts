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
      shape: "ellipse",
      "background-color": "#fff",
      width: "35",
      height: "35",
      label: canUseLabels ? "data(label)" : "",
    },
  },
  {
    selector: ".typescript",
    style: {
      shape: "heptagon",
      "background-color": "#eac73e",
    },
  },
  {
    selector: ".vue",
    style: {
      shape: "heptagon",
      "background-color": "#74cc4b",
    },
  },
  {
    selector: ".json",
    style: {
      shape: "heptagon",
      "background-color": "#4985be",
    },
  },
  {
    selector: ".default",
    style: {
      shape: "heptagon",
      "background-color": "#4a4a4c",
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

export const setNodeStyles = (cy: any, nodeCurrentFile?: string) => {
  cy.nodes().forEach((node: any) => {
    const nodePath = node.data().fullPath;

    if (nodeCurrentFile && node.data().fullPath === nodeCurrentFile) {
      node.classes("selectedNode");
    } else if (nodePath.endsWith(".ts")) {
      node.classes("typescript");
    } else if (nodePath.endsWith(".vue")) {
      node.classes("vue");
    } else if (nodePath.endsWith(".json")) {
      node.classes("json");
    } else {
      node.classes("default");
    }
  });
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
