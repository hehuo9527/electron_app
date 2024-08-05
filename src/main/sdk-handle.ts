import { ChildProcess, exec, execFile, execSync } from "child_process";
import { BrowserWindow } from "electron";
import * as path from "path";

export function startSDK(windows: BrowserWindow) {
  let cppProcess: ChildProcess | null = null;
  const root_path = path.resolve(__dirname, "../../");
  console.log("path", root_path);
  try {
    windows.webContents.send("socketResp", root_path + "-->startSDK");
    cppProcess = execFile(path.join(root_path, "thread_example.exe"));
  } catch (error) {
    console.error("Error executing file:", error);
  }
  return cppProcess;
}
