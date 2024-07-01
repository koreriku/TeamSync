// main.js
const {
  app,
  Tray,
  BrowserWindow,
  ipcMain,
  shell,
  Menu,
  nativeImage,
} = require("electron");
const path = require("path");

let win;
let tray;
let closeAppFlg = false;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "static", "image", "typescript.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  win.loadFile("index.html");
  //win.webContents.openDevTools();
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http")) {
      shell.openExternal(url);
    }
    return { action: "deny" };
  });

  // ウィンドウが閉じられた時の処理
  win.on("close", (event) => {
    // ウィンドウを非表示にする
    win.hide();
    // デフォルトの閉じる動作を無効化する
    if (!closeAppFlg) {
      event.preventDefault();
    }
  });
}

function createTray() {
  const img = nativeImage.createFromPath(
    path.join(__dirname, "static", "image", "typescript.png")
  );
  tray = new Tray(img);

  tray.setToolTip("TeamSync-Notificator");
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: "閉じる",
        click: () => {
          closeAppFlg = true;
          app.quit();
        },
      },
    ])
  );
  tray.on("click", () => {
    if (win.isVisible()) {
      // ウィンドウが既に表示されている場合は非表示にする
      win.hide();
    } else {
      // ウィンドウが非表示の場合は表示する
      win.show();
    }
  });
}

const menu = Menu.buildFromTemplate([]);
Menu.setApplicationMenu(menu);

app.whenReady().then(() => {
  createWindow();
  createTray();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("open-url", (event, url) => {
  shell.openExternal(url);
});
