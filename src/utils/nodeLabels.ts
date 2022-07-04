import { styles } from "./cytoscapeHelper";

export let canUseLabels = true;

export const runNodeLabels = (cy: any) => {
  // LABEL EVENT LISTENERS
  const labelSwitch = document?.getElementById(
    "label-switch"
  ) as HTMLInputElement;
  labelSwitch.onchange = () => {
    canUseLabels = !canUseLabels;
    cy.style(styles(canUseLabels));
  };
};
