import * as vscode from "vscode";
import { GraphProvider } from "./GraphProvider";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "CodeGraphy" is now active!');

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
