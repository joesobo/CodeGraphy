import * as vscode from "vscode"
import { fetchDirFiles } from "../utils/files/fetchDirFiles"
import { getAllConnections } from "../utils/connections/connections"
import { handleMessages } from "../utils/vscode/handleMessages"

export class GraphProvider implements vscode.WebviewViewProvider {
	_view?: vscode.WebviewView
	_doc?: vscode.TextDocument

	constructor(private readonly _extensionUri: vscode.Uri) {}

	public resolveWebviewView(webviewView: vscode.WebviewView) {
		this._view = webviewView

		webviewView.webview.options = {
			enableScripts: true,
			localResourceRoots: [this._extensionUri]
		}

		this.updateWebview(webviewView)
	}

	private async updateWebview(webviewView: vscode.WebviewView) {
		webviewView.webview.html = await this._getHtmlForWebview(
			webviewView.webview
		)
	}

	public revive(panel: vscode.WebviewView) {
		this._view = panel
	}

	private async _getHtmlForWebview(webview: vscode.Webview) {
		// setup HTML links
		const vueURI = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "dist", "compiled/index.es.js")
		)
		const styleMainUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "src/assets", "style.css")
		)
		const tailwindUri = webview.asWebviewUri(
			vscode.Uri.joinPath(this._extensionUri, "dist", "output.css")
		)

		// VSCode configuration
		const codeGraphyConf = vscode.workspace.getConfiguration().codegraphy
		const selectedColor = codeGraphyConf.selectedColor
		const nodeSettings = codeGraphyConf.nodeSettings
		const blacklistSettings = codeGraphyConf.blacklist

		// Workspace information
		const currentPath = vscode.workspace.workspaceFolders
			? vscode.workspace.workspaceFolders[0].uri.path.substring(1)
			: ""
		let currentFile = vscode.window.activeTextEditor?.document.fileName || ""
		currentFile = currentFile.startsWith("/")
			? currentFile.substring(1)
			: currentFile
		let files = fetchDirFiles(currentPath, blacklistSettings)
		let connections = await getAllConnections(files, currentPath)

		// on file save update files and connections
		vscode.workspace.onDidSaveTextDocument(async () => {
			files = fetchDirFiles(currentPath, blacklistSettings, true)
			connections = await getAllConnections(files, currentPath)

			await webview.postMessage({
				command: "setFilesAndConnections",
				text: {
					files,
					connections
				}
			})
		})

		// Handle message calls to and from the Vue side
		await handleMessages(webview)

		return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.21.1/cytoscape.min.js" integrity="sha512-H44mkyNG9R5Y8NDjFoZ0lnMGgxfsbfbuewUNJJjecVOUzR3n/JL8+UFc07pP74T5tA+aGOMKCwazdDYwoquE8g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <link href="${styleMainUri}" rel="stylesheet">
        <link href="${tailwindUri}" rel="stylesheet">
      </head>

      <body>
        <div id="app">
          <div id="cy"></div>
        </div>

        <script type="module"
          // Vue
          src="${vueURI}">
        </script>

        <script>
          // Connection and file data transfer
          var connections = ${JSON.stringify(connections)}
          var files = ${JSON.stringify(files)}
          var currentFile = ${JSON.stringify(currentFile)}
          var selectedColor = ${JSON.stringify(selectedColor)}
          var nodeSettings = ${JSON.stringify(nodeSettings)}
          var blacklistSettings = ${JSON.stringify(blacklistSettings)}
          var vscode = acquireVsCodeApi();
        </script>
      </body>
    </html>`
	}
}
