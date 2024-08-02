import { ChildProcess, exec, execFile, execSync } from "child_process";
import * as path from "path";

export function startSDK() {
  let cppProcess: ChildProcess | null = null;
  const root_path = path.resolve(__dirname, "../../");
  try {
    if (process.env.NODE_ENV == "development") {
      cppProcess = execFile(path.join(root_path, "thread_example.exe"));
    } else {
      // TODO 这里Path应该读环境变量
      cppProcess = exec(
        "C:\\Users\\7000031561\\Desktop\\CameraSDK_Release\\CameraSDK.exe",
      );
    }
  } catch (error) {
    console.error("Error executing file:", error);
  }
  return cppProcess;
}
