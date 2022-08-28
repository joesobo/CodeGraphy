import { styles } from "../cytoscape/cytoscapeHelper";

export let canUseLabels = true;

export const toggleLabels = () => {
  canUseLabels = !canUseLabels;
};

export const runNodeLabels = (cy: any) => {
  // LABEL EVENT LISTENERS
  const labelSwitch = document?.getElementById(
    "label-switch"
  ) as HTMLInputElement;
  labelSwitch.onchange = () => {
    canUseLabels = labelSwitch.checked;
    cy.style(styles(canUseLabels));
  };
};
