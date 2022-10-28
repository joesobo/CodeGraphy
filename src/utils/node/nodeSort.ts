import { reload } from "../cytoscape/cytoscapeHelper"

export let sortingOption = "fcose"

export const runNodeSort = (cy: any) => {
	// SORT EVENT LISTENERS
	const select = document.getElementById("sorting-options") as HTMLSelectElement
	sortingOption = select.options[select.selectedIndex].value

	select.onchange = () => {
		sortingOption = select.options[select.selectedIndex].value
		reload(cy, sortingOption)
	}
}
