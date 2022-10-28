import cytoscape from "cytoscape"

import { reload } from "../cytoscape/cytoscapeHelper"
import cypopper from "cytoscape-popper"
import coseBilkent from "cytoscape-cose-bilkent"
import fcose from "cytoscape-fcose"
import cola from "cytoscape-cola"

cytoscape.use(cypopper)
cytoscape.use(coseBilkent)
cytoscape.use(fcose)
cytoscape.use(cola)

export const getNewCytoscape = (
	nodes: any[],
	nodeStyles: any,
	htmlElement: HTMLElement
) =>
	cytoscape({
		container: htmlElement,
		elements: nodes,
		style: nodeStyles,
		layout: {
			name: "fcose"
		},

		// initial viewport state:
		zoom: 1,
		pan: { x: 0, y: 0 },

		// interaction options:
		minZoom: 1 / 2,
		maxZoom: 4,
		wheelSensitivity: 0.25,
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
		pixelRatio: "auto"
	} as any)
