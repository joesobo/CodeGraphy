import { reload } from "./cytoscapeHelper";

const select = document.getElementById("sorting-options") as HTMLSelectElement;
export let sortingOption = select.options[select.selectedIndex].value;

export const runNodeSort = (cy: any) => {
  // SORT EVENT LISTENERS
  const select = document.getElementById(
    "sorting-options"
  ) as HTMLSelectElement;
  sortingOption = select.options[select.selectedIndex].value;

  select.onchange = () => {
    sortingOption = select.options[select.selectedIndex].value;
    reload(cy, sortingOption);
  };
};
