import * as vscode from "vscode";

export const handleMessages = async (webview: vscode.Webview) => {
  // Handle messages from the webview
  handleReceivedMessages(webview);

  handleSendMessages(webview);
};

const handleReceivedMessages = (webview: vscode.Webview) => {
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
