const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");
const path = require("path");

const { downloadVideo, videoInfo } = require("./downloader.js");
const { url } = require("inspector");

const isDev = process.env.NODE_ENV !== "production";
const isMac = process.platform === "darwin";

let mainWindow;

// create the main window


function createMainWindow() {
  try {
    mainWindow = new BrowserWindow({
      width: isDev ? 1200: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.js"),
      },
    });

    // Open devtools if in dev mode
    if (isDev) {
      mainWindow.webContents.openDevTools();
    }

    mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"));

    mainWindow.once("ready-to-show", () => {
      mainWindow.show();
    });

    mainWindow.on("closed", () => {
      mainWindow = null;
    });
  } catch (error) {
    console.error(error);
  }
}

function createPlayerWindow(url) {
  try {
    playerWindow = new BrowserWindow({
      width: 1920,
      height: 1080,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.js"),
  }});
      playerWindow.loadURL(url);
    // shell.openExternal(url);
  }

   catch (error) {
    console.error(error);
  }
}

ipcMain.on("url", async (event, url) => {
  try {
    const video = await videoInfo(url);
    console.log("Video info:", video);
    mainWindow.webContents.send("video-info", video);
  } catch (error) {
    console.error("Error processing video info:", error);
  }
});

ipcMain.on('play-video', (event, url) => {
  console.log('Playing video:', url);
  createPlayerWindow(url);
})

// app is ready

app.whenReady().then(() => {
  createMainWindow();

  // Implemet menu
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  mainWindow.on("closed", () => (mainWindow = null));
  
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

//Menu template
const menu = [
  {
    label: "File",
    submenu: [
      {
        label: "Quit",
        click: () => app.quit(),
        accelerator: "CmdOrCtrl+Q",
      },
    ],
  },
];

// Quit app when all windows are closed

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});
