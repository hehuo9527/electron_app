import { ChildProcess, exec, execFile, execSync } from "child_process";
import * as path from "path";

export function startSDK() {
  let cppProcess: ChildProcess | null = null;
  const root_path = path.resolve(__dirname, "../../");
  console.log("path", root_path);
  try {
    cppProcess = execFile(path.join(root_path, "cpp_serve/thread_example.exe"));
  } catch (error) {
    console.error("Error executing file:", error);
  }
  return cppProcess;
}
