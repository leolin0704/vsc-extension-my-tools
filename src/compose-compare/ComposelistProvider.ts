import * as vscode from "vscode";
import { glob } from "glob";

export class ComposelistProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  constructor(private workspaceRoot: string) {}

  private _onDidChangeTreeData: vscode.EventEmitter<
    vscode.TreeItem | undefined | null | void
  > = new vscode.EventEmitter<vscode.TreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    vscode.TreeItem | undefined | null | void
  > = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: vscode.TreeItem): Promise<vscode.TreeItem[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage(
        "No compose list in empty workspace"
      );
      return Promise.resolve([]);
    }

    if (!element) {
      const jsfiles = await glob(`${this.workspaceRoot}/**/*compose.json`, {
        ignore: "node_modules/**",
      });
      return jsfiles.map((file) => {
        const item = new vscode.TreeItem(file);
        item.command = {
          command: "composelist.click",
          title: "ComposeClick",
          arguments: [file],
        };
        return item;
      });
    }

    return [];
  }
}
