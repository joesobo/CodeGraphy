import * as vscode from "vscode";
import { dirIt } from "../utils/dirIt";
import { getConnections, Connection } from "../utils/connections";

const currentPath = vscode.workspace.workspaceFolders
  ? vscode.workspace.workspaceFolders[0].uri.path.substring(1)
  : "";
let currentFile = vscode.window.activeTextEditor?.document.fileName || "";
currentFile = currentFile.startsWith("/")
  ? currentFile.substring(1)
  : currentFile;
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
    const vueURI = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "dist", "compiled/index.es.js")
    );
    const styleMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "src/assets", "style.css")
    );
    const allConnections: Connection[][] = await getConnections(
      files,
      currentPath
    );

    const configuration = vscode.workspace.getConfiguration();
    const nodeSettings = configuration.codegraphy.nodeSettings;
    // Handle messages from the webview
    webview.onDidReceiveMessage(async (message) => {
      switch (message.command) {
        case "openFile":
          // open new file
          const openPath = vscode.Uri.file(message.text);

          vscode.workspace
            .openTextDocument(openPath)
            .then(async (doc) => {
              await vscode.window.showTextDocument(doc);

              // update reference of currently open file
              let currentFile =
                vscode.window.activeTextEditor?.document.fileName || "";
              currentFile = currentFile.startsWith("/")
                ? currentFile.substring(1)
                : currentFile;

              webview.postMessage({ command: "setCurrentFile", text: currentFile });
            });

          return;
        case "editSettings":
          return await configuration.update(
            "codegraphy.nodeSettings",
            message.text
          );
      }
    });

    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.21.1/cytoscape.min.js" integrity="sha512-H44mkyNG9R5Y8NDjFoZ0lnMGgxfsbfbuewUNJJjecVOUzR3n/JL8+UFc07pP74T5tA+aGOMKCwazdDYwoquE8g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
        <link href="${styleMainUri}" rel="stylesheet">
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
          var connections = ${JSON.stringify(allConnections)}
          var files = ${JSON.stringify(files)}
          var currentFile = ${JSON.stringify(currentFile)}
          var nodeSettings = ${JSON.stringify(nodeSettings)}
          var vscode = acquireVsCodeApi();
        </script>
      </body>
    </html>`;
  }
}
