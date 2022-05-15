import * as vscode from "vscode";

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

    const updateWebview = () => {
      webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    };

    updateWebview();
    // const interval = setInterval(updateWebview, 10);

    // webviewView.onDidDispose(() => {
    //   clearInterval(interval);
    // }, null);
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
      </head>
      <body>
        <h1>Hello World!</h1>
      </body>
    </html>`;
  }
}
