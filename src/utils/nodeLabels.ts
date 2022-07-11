import { styles } from "./cytoscapeHelper";

const labelSwitch = document?.getElementById(
  "label-switch"
) as HTMLInputElement;

export let canUseLabels = labelSwitch.checked;

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
