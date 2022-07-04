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
    selector: "label",
    style: {
      color: "#d4d4d4",
      // @ts-ignore
      fontSize: 12,
    },
  },
];
