import * as vscode from "vscode";
import { dirIt } from "./utils/dirIt";

const canvasSize: number = 300;

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

    const currentPath = vscode.workspace.workspaceFolders
      ? vscode.workspace.workspaceFolders[0].uri.path
      : "";
    const files = dirIt(currentPath.substring(1)) || [];

    this.updateWebview(webviewView, files);
  }

  private updateWebview(webviewView: vscode.WebviewView, files: string[]) {
    webviewView.webview.html = this._getHtmlForWebview(
      webviewView.webview,
      files
    );
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview, files: string[]) {
    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/cytoscape/3.21.1/cytoscape.min.js" integrity="sha512-H44mkyNG9R5Y8NDjFoZ0lnMGgxfsbfbuewUNJJjecVOUzR3n/JL8+UFc07pP74T5tA+aGOMKCwazdDYwoquE8g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
      </head>
      <body>
        <h1>Hello World!</h1>
        <p>${files.length}</p>
        <div id="cy" style="height: ${canvasSize}px; width: ${canvasSize}px;"></div>
        <script>
            var cy = cytoscape({
                container: document.getElementById('cy'),
                elements: [
                    // list of graph elements to start with
                    {
                        // node a
                        data: { id: "a" },
                    },
                    {
                        // node b
                        data: { id: "b" },
                    },
                    {
                        // edge ab
                        data: { id: "ab", source: "a", target: "b" },
                    },
                ],
                style: [
                    // the stylesheet for the graph
                    {
                        selector: "node",
                        style: {
                        "background-color": "#666",
                        label: "data(id)",
                        },
                    },
                    {
                        selector: "edge",
                        style: {
                        width: 3,
                        "line-color": "#ccc",
                        "target-arrow-color": "#ccc",
                        "target-arrow-shape": "triangle",
                        "curve-style": "bezier",
                        },
                    },
                ],
                layout: {
                    name: "grid",
                    rows: 1,
                },

                // initial viewport state:
                zoom: 1,
                pan: { x: 0, y: 0 },

                // interaction options:
                minZoom: 1/2,
                maxZoom: 2,
                zoomingEnabled: true,
                userZoomingEnabled: true,
                panningEnabled: true,
                userPanningEnabled: true,
                boxSelectionEnabled: true,
                selectionType: 'single',
                touchTapThreshold: 8,
                desktopTapThreshold: 4,
                autolock: false,
                autoungrabify: false,
                autounselectify: false,
                multiClickDebounceTime: 250,

                // rendering options:
                headless: false,
                styleEnabled: true,
                hideEdgesOnViewport: false,
                textureOnViewport: false,
                motionBlur: true,
                motionBlurOpacity: 0.2,
                wheelSensitivity: 1,
                pixelRatio: 'auto'
            });
        </script>
      </body>
    </html>`;
  }
}
