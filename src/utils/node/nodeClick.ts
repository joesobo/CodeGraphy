export const runNodeClick = (cy: any, nodes: any[]) => {
	// CLICK NODE EVENT
	cy.on("click", "node", function (event: any) {
		const id = event.target.id()

		const path = nodes[id].data.fullPath

		openFile(path)
	})
}

// Ability to open file on click
const openFile = (file: string) => {
	vscode.postMessage({
		command: "openFile",
		text: file
	})
}
