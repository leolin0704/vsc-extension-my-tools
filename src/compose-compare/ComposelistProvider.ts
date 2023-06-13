import * as vscode from "vscode";
import * as fs from "fs-extra";
import * as path from "path";
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
      const composeTmpDir = path.join(this.workspaceRoot, ".vscode/.compose");
      if (fs.existsSync(composeTmpDir)) {
        fs.rmSync(composeTmpDir);
      }
      fs.ensureDirSync(composeTmpDir);
      const jsfiles = await glob(`${this.workspaceRoot}/**/*compose.json`, {
        ignore: "node_modules/**",
      });
      return jsfiles.map((file) => {
        const composeFile = fs.readFileSync(file, "utf8");
        const tmpPath = path.join(composeTmpDir, file.replace(/[\/\\]/g, "_"));
        console.log(tmpPath, "start");
        fs.appendFileSync(tmpPath, this.convertComposeFile(composeFile), {});
        console.log(tmpPath, "end");
        const item = new vscode.TreeItem(file);
        item.command = {
          command: "composelist.click",
          title: "ComposeClick",
          arguments: [tmpPath],
        };
        return item;
      });
    }

    return [];
  }

  convertComposeFile(context: string) {
    return context;
  }
}
