import { setNodeVisibility } from "../cytoscape/cytoscapeHelper"

export let canUseSelectedOnly = false

export const toggleSelectedOnly = () => {
	canUseSelectedOnly = !canUseSelectedOnly
}

export const runNodeSelectedOnly = (cy: any) => {
	// SELECTED ONLY EVENT LISTENERS
	const selectedOnlySwitch = document?.getElementById(
		"selected-only-switch"
	) as HTMLInputElement

	selectedOnlySwitch.onchange = () => {
		canUseSelectedOnly = selectedOnlySwitch.checked

		setNodeVisibility(cy, canUseSelectedOnly)
	}
}
