import { processData } from "../node/dataProcessor"
import { styles, reload, setNodeStyles } from "../cytoscape/cytoscapeHelper"
import { getNewCytoscape } from "../cytoscape/cytoscapeGraphCreator"
import { runNodeClick } from "../node/nodeClick"
import { runNodeHover } from "../node/nodeHover"
import { runNodeSelectedOnly } from "../node/nodeSelectedOnly"
import { canUseLabels, runNodeLabels } from "../node/nodeLabels"
import { runNodeSort } from "../node/nodeSort"

const nodeFiles = files
const nodeConnections = connections
const nodeCurrentFile = currentFile

export const setupMainGraph = (mainGraphElement: HTMLElement | undefined) => {
	if (mainGraphElement) {
		const nodes = processData(nodeFiles, nodeConnections)
		const cy = getNewCytoscape(nodes, styles(canUseLabels), mainGraphElement)

		runNodeHover(cy)
		runNodeLabels(cy)
		runNodeSelectedOnly(cy)
		runNodeSort(cy)
		runNodeClick(cy, nodes)

		refreshMainGraph(cy, nodeCurrentFile, nodeFiles, nodeConnections)
		cy.layout({ name: "fcose" }).run()

		return cy
	}
}

export const setupRelativeGraph = (
	relativeGraphElement: HTMLElement | undefined
) => {
	if (relativeGraphElement) {
		const nodes = processData(nodeFiles, nodeConnections, 1, nodeCurrentFile)
		const cyRelative = getNewCytoscape(
			nodes,
			styles(canUseLabels),
			relativeGraphElement
		)

		runNodeSort(cyRelative)
		runNodeClick(cyRelative, nodes)

		refreshLocalGraph(cyRelative, nodeCurrentFile, nodeFiles, nodeConnections)
		cyRelative.layout({ name: "fcose" }).run()

		return cyRelative
	}
}

export const refreshMainGraph = (
	mainCy: any,
	nodeCurrentFile: any,
	nodeFiles: any,
	nodeConnections: any
) => {
	const nodes = processData(nodeFiles, nodeConnections)

	mainCy.elements().remove()
	mainCy.add(nodes)

	setNodeStyles(mainCy, nodeCurrentFile)

	reload(mainCy, "reload")
}

export const refreshLocalGraph = (
	relativeCy: any,
	nodeCurrentFile: any,
	nodeFiles: any,
	nodeConnections: any,
	localDepth = 1
) => {
	const nodes = processData(
		nodeFiles,
		nodeConnections,
		localDepth,
		nodeCurrentFile
	)

	relativeCy.elements().remove()
	relativeCy.add(nodes)

	// turn off old click listener to update with new depth nodes
	relativeCy.off("click")
	runNodeClick(relativeCy, nodes)

	setNodeStyles(relativeCy, nodeCurrentFile)

	reload(relativeCy, "reload")
}
