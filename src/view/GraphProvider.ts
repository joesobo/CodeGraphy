import * as vscode from "vscode";
import { dirIt } from "../utils/dirIt";
import { getConnections, Connections } from "../utils/connections";

const currentPath = vscode.workspace.workspaceFolders
  ? vscode.workspace.workspaceFolders[0].uri.path.substring(1)
  : "";
const currentDir = vscode.workspace.workspaceFolders
  ? vscode.workspace.workspaceFolders[0].name
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
    const allConnections: Connections[] = await getConnections(files);

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
        <p>Directory: /${currentDir}</p>
        <div id="cy"></div>
        <script>
            var connections = ${JSON.stringify(allConnections)}
            var files = ${JSON.stringify(files)}
        </script>
        <script type="module"
            src="${scriptUri}">
        </script>
        <button id="reload-button">Reload</button>
        <div style="display: flex; flex-wrap: wrap;">
            <button id="cose-button" style="margin-right: 8px;">Cose</button>
            <button id="fcose-button" style="margin-right: 8px;">FCose</button>
            <button id="cose-bilkent-button" style="margin-right: 8px;">Cose Bilkent</button>
            <button id="cola-button" style="margin-right: 8px;">Cola</button>
            
            <button id="grid-button" style="margin-right: 8px;">Grid</button>
            <button id="random-button" style="margin-right: 8px;">Random</button>
            <button id="circle-button" style="margin-right: 8px;">Circle</button>
            <button id="concentric-button" style="margin-right: 8px;">Concentric</button>
            <button id="breadthfirst-button" style="margin-right: 8px;">Breadthfirst</button>
        </div>
      </body>
    </html>`;
  }
}
