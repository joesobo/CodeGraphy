import * as vscode from "vscode";
import fetch from "node-fetch";

const canvasSize: number = 300;

const currentPath = vscode.workspace.workspaceFolders
  ? vscode.workspace.workspaceFolders[0].uri.path.substring(1)
  : "";
const currentDir = vscode.workspace.workspaceFolders
  ? vscode.workspace.workspaceFolders[0].name
  : "";

fetch(`http://localhost:8081/`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ url: currentPath, dir: currentDir }),
});

export class GraphProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    this.updateWebview(webviewView);
  }

  private updateWebview(webviewView: vscode.WebviewView) {
    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "src", "cytoscapeGraph.js")
    );

    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.21.1/cytoscape.min.js" integrity="sha512-H44mkyNG9R5Y8NDjFoZ0lnMGgxfsbfbuewUNJJjecVOUzR3n/JL8+UFc07pP74T5tA+aGOMKCwazdDYwoquE8g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
      </head>
      <body>
        <h1>Code Graph</h1>
        <div id="cy" style="height: ${canvasSize}px; width: ${canvasSize}px; background-color: #1e1e1e"></div>
        <script type="module" src="${scriptUri}"></script>
      </body>
    </html>`;
  }
}
