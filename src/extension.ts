// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as fs from "fs";
import { ComposelistProvider } from "./compose-compare/ComposelistProvider";

let targetComposeFile: vscode.Uri;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "vsc-extension-my-tool" is now active!'
  );

  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;

  if (rootPath) {
    const composelistProvider = new ComposelistProvider(rootPath);
    vscode.window.registerTreeDataProvider("composelist", composelistProvider);

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposableRefreshEntry = vscode.commands.registerCommand(
      "composelist.refreshEntry",
      () => {
        composelistProvider.refresh();
      }
    );

    context.subscriptions.push(disposableRefreshEntry);

    let disposableComposeClick = vscode.commands.registerCommand(
      "composelist.click",
      async (filePath) => {
        let uri = vscode.Uri.file(filePath);
        if (!targetComposeFile) {
          await vscode.commands.executeCommand("vscode.open", uri);
        } else {
          await vscode.commands.executeCommand(
            "vscode.diff",
            targetComposeFile,
            uri
          );
        }
        targetComposeFile = uri;
      }
    );
    context.subscriptions.push(disposableComposeClick);
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}
