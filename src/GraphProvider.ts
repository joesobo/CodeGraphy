import * as vscode from "vscode";
import { dirIt } from "./utils/dirIt";
import { getConnections, Connections } from "./utils/connections";

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
      vscode.Uri.joinPath(this._extensionUri, "src", "cytoscapeGraph.js")
    );
    const allConnections: Connections[] = await getConnections(
      files,
      currentPath,
      currentDir
    );

    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.21.1/cytoscape.min.js" integrity="sha512-H44mkyNG9R5Y8NDjFoZ0lnMGgxfsbfbuewUNJJjecVOUzR3n/JL8+UFc07pP74T5tA+aGOMKCwazdDYwoquE8g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
      </head>
      <body>
        <h1>CodeGraphy</h1>
        <p>${currentDir}</p>
        <div id="cy" style="height: 300px; width: 300px; background-color: #1e1e1e"></div>
        <script>
            var connections = ${JSON.stringify(allConnections)}
            var files = ${JSON.stringify(files)}
            var path = ${JSON.stringify(currentPath)}
        </script>
        <script type="module" src="${scriptUri}"></script>
        <button style="padding: 4px 8px; margin-top: 8px; background-color: '#1177bb';" type="button" onclick="reload()">Reload</button>
      </body>
    </html>`;
  }
}
