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
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        "dist",
        "compiled/cytoscapeGraph.js"
      )
    );
    const relativeScriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(
        this._extensionUri,
        "dist",
        "compiled/cytoscapeRelativeGraph.js"
      )
    );
    const testURI = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "dist", "compiled/index.es.js")
    );
    const allConnections: Connection[][] = await getConnections(
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

        .popper-div {
            position: relative;
            background-color: #333;
            color: #fff;
            border-radius: 4px;
            font-size: 14px;
            line-height: 1.4;
            outline: 0;
            padding: 5px 9px;
            max-width: 200px;
            overflow-wrap: break-word;
        }

        /* The switch - the box around the slider */
        .switch {
            margin-top: 2px;
            margin-left: 8px;
            position: relative;
            display: inline-block;
            width: 30px;
            height: 17px;
        }

        /* Hide default HTML checkbox */
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        /* The slider */
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            -webkit-transition: .4s;
            transition: .4s;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 13px;
            width: 13px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            -webkit-transition: .4s;
            transition: .4s;
        }

        input:checked + .slider {
            background-color: #2196F3;
        }

        input:focus + .slider {
            box-shadow: 0 0 1px #2196F3;
        }

        input:checked + .slider:before {
            -webkit-transform: translateX(13px);
            -ms-transform: translateX(13px);
            transform: translateX(13px);
        }

        /* Rounded sliders */
        .slider.round {
            border-radius: 17px;
        }

        .slider.round:before {
            border-radius: 50%;
        }
      </style>

      <body>
        <div id="app"></div>

        <script type="module"
          // Vue
          src="${testURI}">
        </script>

        <script>
          // Connection and file data transfer
          var connections = ${JSON.stringify(allConnections)}
          var files = ${JSON.stringify(files)}
          var currentFile = ${JSON.stringify(currentFile)}
        </script>

        <script type="module"
          // Running Cytoscape Graph
          src="${scriptUri}">
        </script>

        <script type="module"
          // Running Cytoscape Relative Graph
          src="${relativeScriptUri}">
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
      </body>
    </html>`;
  }
}
