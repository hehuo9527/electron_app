import { app, shell, BrowserWindow, ipcMain } from "electron";
import path, { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import SocketClient from "../utils/socket-client";
import { initServe } from "./ipc-handle";
let mainWindow: BrowserWindow;
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    autoHideMenuBar: true,
    resizable: false,
    frame: false,
    icon: join(__dirname, "../../resources/icon.ico"),
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });
  mainWindow.setMaximizable(false);
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.openDevTools();

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
  // 处理最小化消息
  ipcMain.on("minimize", () => {
    mainWindow.minimize();
  });
  // 处理关闭消息
  ipcMain.on("close", () => {
    mainWindow.close();
  });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.qiu.csc");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  // use socket client
  ipcMain.handle("test_ipc", (event, data) => {
    console.log(`handle `, data);
    mainWindow.webContents.send("log", "test_ipc to vue");
  });
  initServe()
    .then((result: any) => {
      console.log(result.status);
      mylog("start serve");
    })
    .catch((error) => {
      console.error("Failed to start the server:", error.error);
      mainWindow.webContents.on("did-finish-load", () => {
        mainWindow.webContents.send(
          "log",
          `start server failed: ${error.error.message}`,
        );
      });
    });
  // mainWindow.webContents.send("log", "start server success");
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
export function mylog(log_msg: string) {
  console.log("send-->", log_msg);
  // mainWindow.webContents.on("did-finish-load", () => {
  mainWindow.webContents.send("log", log_msg + "hh");
  // });
}
