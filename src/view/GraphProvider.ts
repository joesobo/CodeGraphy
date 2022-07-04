import * as vscode from "vscode";
import { dirIt } from "../utils/dirIt";
import { getConnections, Connections } from "../utils/connections";

const currentPath = vscode.workspace.workspaceFolders
  ? vscode.workspace.workspaceFolders[0].uri.path.substring(1)
  : "";
const files: string[] = dirIt(currentPath);

export class GraphProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    this.updateWebview(webviewView);
  }

  private async updateWebview(webviewView: vscode.WebviewView) {
    webviewView.webview.html = await this._getHtmlForWebview(
      webviewView.webview
    );
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private async _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        "dist",
        "compiled/cytoscapeGraph.js"
      )
    );
    const allConnections: Connections[] = await getConnections(
      files,
      currentPath
    );

    // Handle messages from the webview
    webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case "openFile":
          const openPath = vscode.Uri.file(message.text);
          vscode.workspace.openTextDocument(openPath).then((doc) => {
            vscode.window.showTextDocument(doc);
          });
          return;
      }
    });

    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.21.1/cytoscape.min.js" integrity="sha512-H44mkyNG9R5Y8NDjFoZ0lnMGgxfsbfbuewUNJJjecVOUzR3n/JL8+UFc07pP74T5tA+aGOMKCwazdDYwoquE8g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
      </head>

      <style>
        button {
          padding: 8px 16px;
          margin-top: 8px;
          background-color: #1177bb;
          color: white;
          border: none;
          cursor: pointer;
        }
      </style>

      <body>
        <h1>CodeGraphy</h1>
        <div id="cy"></div>

        <script>
          // Connection and file data transfer
          var connections = ${JSON.stringify(allConnections)}
          var files = ${JSON.stringify(files)}
        </script>

        <script type="module"
          // Running Cytoscape Graph
          src="${scriptUri}">
        </script>

        <script>
          // Ability to open file on click
          const vscode = acquireVsCodeApi();
          var openFile = (file) => {
            vscode.postMessage({
              command: 'openFile',
              text: file,
            })
          }
        </script>

        <button id="reload" style="width: 100%; margin-bottom: 8px">Reload</button>

        <label>Sorting:</label>
        <select onchange="changeSorting()" id="sorting-options">
            <option value="cose" selected>Cose</option>
            <option value="fcose">FCose</option>
            <option value="cose-bilkent">Cose Bilkent</option>
            <option value="cola">Cola</option>
            <option value="grid">Grid</option>
            <option value="random">Random</option>
            <option value="circle">Circle</option>
            <option value="concentric">Concentric</option>
            <option value="breadthfirst">Breadthfirst</option>
        </select>
      </body>
    </html>`;
  }
}
