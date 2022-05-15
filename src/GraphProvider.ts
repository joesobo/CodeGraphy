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
        <div id="cy" style="height: ${canvasSize}px; width: ${canvasSize}px; background-color: #1e1e1e"></div>
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
                        // node b
                        data: { id: "c" },
                    },
                    {
                        // node b
                        data: { id: "d" },
                    },
                    {
                        // node b
                        data: { id: "e" },
                    },
                    {
                        // node b
                        data: { id: "f" },
                    },
                    {
                        // edge ab
                        data: { id: "ab", source: "a", target: "b" },
                    },
                    {
                        // edge ac
                        data: { id: "ac", source: "a", target: "c" },
                    },
                    {
                        // edge ad
                        data: { id: "ad", source: "a", target: "d" },
                    },
                    {
                        // edge af
                        data: { id: "af", source: "a", target: "f" },
                    },
                    {
                        // edge fb
                        data: { id: "fb", source: "f", target: "b" },
                    },
                    {
                        // edge fc
                        data: { id: "fc", source: "f", target: "c" },
                    },
                    {
                        // edge de
                        data: { id: "de", source: "d", target: "e" },
                    },
                ],
                style: [
                    {
                        selector: "node",
                        style: {
                            "background-color": "#4a4a4c",
                            label: "data(id)",
                        },
                    },
                    {
                        selector: "edge",
                        style: {
                            width: 2,
                            "line-color": "#d4d4d4",
                            "target-arrow-color": "#d4d4d4",
                            "target-arrow-shape": "triangle",
                            "curve-style": "bezier",
                        },
                    },
                    {
                        selector: "label",
                        style: {
                            "color": "#d4d4d4",
                            "text-transform": "uppercase",
                        },
                    },
                ],

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

                // rendering options:
                headless: false,
                styleEnabled: true,
                hideEdgesOnViewport: false,
                textureOnViewport: false,
                motionBlur: false,
                motionBlurOpacity: 0.2,
                wheelSensitivity: 1,
                pixelRatio: 'auto'
            });

            let options = {
                name: 'cose',

                // Called on 'layoutready'
                ready: function(){},

                // Called on 'layoutstop'
                stop: function(){},

                // Whether to animate while running the layout
                // true : Animate continuously as the layout is running
                // false : Just show the end result
                // 'end' : Animate with the end result, from the initial positions to the end positions
                animate: true,

                // Easing of the animation for animate:'end'
                animationEasing: undefined,

                // The duration of the animation for animate:'end'
                animationDuration: undefined,

                // A function that determines whether the node should be animated
                // All nodes animated by default on animate enabled
                // Non-animated nodes are positioned immediately when the layout starts
                animateFilter: function ( node, i ){ return true; },

                // The layout animates only after this many milliseconds for animate:true
                // (prevents flashing on fast runs)
                animationThreshold: 250,

                // Number of iterations between consecutive screen positions update
                refresh: 20,

                // Whether to fit the network view after when done
                fit: true,

                // Padding on fit
                padding: 30,

                // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
                boundingBox: undefined,

                // Excludes the label when calculating node bounding boxes for the layout algorithm
                nodeDimensionsIncludeLabels: false,

                // Randomize the initial positions of the nodes (true) or use existing positions (false)
                randomize: true,

                // Extra spacing between components in non-compound graphs
                componentSpacing: 40,

                // Node repulsion (non overlapping) multiplier
                nodeRepulsion: function( node ){ return 2048; },

                // Node repulsion (overlapping) multiplier
                nodeOverlap: 4,

                // Ideal edge (non nested) length
                idealEdgeLength: function( edge ){ return 32; },

                // Divisor to compute edge forces
                edgeElasticity: function( edge ){ return 32; },

                // Nesting factor (multiplier) to compute ideal edge length for nested edges
                nestingFactor: 1.2,

                // Gravity force (constant)
                gravity: 1,

                // Maximum number of iterations to perform
                numIter: 1000,

                // Initial temperature (maximum node displacement)
                initialTemp: 1000,

                // Cooling factor (how the temperature is reduced between consecutive iterations
                coolingFactor: 0.99,

                // Lower temperature threshold (below this point the layout will end)
                minTemp: 1.0,
            };

            var layout = cy.layout(options);

            layout.run();
        </script>
      </body>
    </html>`;
  }
}
