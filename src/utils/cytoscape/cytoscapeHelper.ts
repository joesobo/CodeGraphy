let layout: any
let lastLayout = "cose"

// CYTOSCAPE GRAPH STYLES
export const styles = (canUseLabels: boolean) => [
	{
		selector: "node",
		style: {
			shape: "heptagon",
			"background-color": "#4a4a4c",
			label: canUseLabels ? "data(label)" : ""
		}
	},
	{
		selector: "edge",
		style: {
			width: 2,
			"line-color": "#d4d4d4",
			"target-arrow-color": "#d4d4d4",
			"target-arrow-shape": "triangle",
			"curve-style": "bezier"
		}
	},
	{
		selector: ".selectedNode",
		style: {
			shape: "ellipse",
			width: "35",
			height: "35"
		}
	},
	{
		selector: "label",
		style: {
			color: "#d4d4d4",
			fontSize: 12
		}
	}
]

// REFRESH LAYOUT
export const reload = (cy: any, layoutOption: string) => {
	setLayout(cy, layoutOption)

	layout.run()
}

// LAYOUT SETUP
const setLayout = (cy: any, layoutName: string) => {
	if (layoutName !== "reload") {
		lastLayout = layoutName
	}

	layout = cy.layout({
		name: layoutName === "reload" ? lastLayout : layoutName,
		animate: "end",
		animationEasing: "ease-out",
		animationDuration: 1000,
		randomize: false,
		infinite: true,
		fit: false
	} as any)
}

export const setNodeStyles = (
	cy: any,
	nodeCurrentFile?: string,
	currentNode?: any
) => {
	// Reset styles
	cy.nodes().forEach((node: any) => {
		node.classes("node")
		node.style({ "background-color": "#4a4a4c" })
	})

	// Apply setting styles
	cy.nodes().forEach((node: any) => {
		const nodePath = node.data().fullPath

		nodeSettings.forEach((nodeMeta: any) => {
			if (nodePath.endsWith(nodeMeta.extension)) {
				node.classes("node")
				node.style({ "background-color": nodeMeta.color })
			}

			if (nodeCurrentFile && nodePath === nodeCurrentFile) {
				node.classes("selectedNode")
				node.style({ "background-color": selectedColor })
			}

			if (currentNode) {
				currentNode.classes("selectedNode")
				currentNode.style({ "background-color": selectedColor })
			}
		})
	})

	cy.style().update()
}

// NEEDED FOR POPOVERS
window.process = {
	env: {
		NODE_ENV: "development"
	}
}
