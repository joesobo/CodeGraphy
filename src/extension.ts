import * as vscode from "vscode";
import { GraphProvider } from "./renderView/GraphProvider";

export function activate(context: vscode.ExtensionContext) {
  const graphProvider = new GraphProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      "code-graphy-sidebar",
      graphProvider
    )
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
