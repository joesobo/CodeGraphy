import * as vscode from "vscode";
import { fetchDirFiles } from "../files/fetchDirFiles";
import { getConnections, Connection } from "../connections/connections";

export const handleMessages = async (
  webview: vscode.Webview,
  currentPath: string,
  files: string[],
  connections: Connection[][],
  whitelistSettings: string[]
) => {
  // Handle messages from the webview
  handleReceivedMessages(
    webview,
    whitelistSettings,
    files,
    currentPath,
    connections
  );

  handleSendMessages(webview);
};

const handleReceivedMessages = (
  webview: vscode.Webview,
  whitelistSettings: string[],
  files: string[],
  currentPath: string,
  connections: Connection[][]
) => {
  webview.onDidReceiveMessage(async (message) => {
    const configuration = vscode.workspace.getConfiguration();

    switch (message.command) {
      case "openFile":
        // open new file
        const openPath = vscode.Uri.file(message.text);

        vscode.workspace.openTextDocument(openPath).then(async (doc) => {
          vscode.window.showTextDocument(doc);
        });
        return;
      case "editMetaSettings":
        return await configuration.update(
          "codegraphy.nodeSettings",
          message.text
        );
      case "editWhitelistSettings":
        await configuration.update(
          "codegraphy.whitelistSettings",
          message.text
        );
        whitelistSettings = message.text;

        // get new connections and nodes
        files = fetchDirFiles(currentPath, whitelistSettings, true);
        connections = await getConnections(files, currentPath);

        // send message to update
        return await webview.postMessage({
          command: "setFilesAndConnections",
          text: { files: files, connections: connections },
        });
    }
  });
};

const handleSendMessages = (webview: vscode.Webview) => {
  vscode.window.onDidChangeActiveTextEditor(async (editor) => {
    if (editor) {
      // update reference of currently open file
      let currentFile = editor?.document.fileName || "";
      currentFile = currentFile.startsWith("/")
        ? currentFile.substring(1)
        : currentFile;

      await webview.postMessage({
        command: "setCurrentFile",
        text: currentFile,
      });
    }
  });
};
