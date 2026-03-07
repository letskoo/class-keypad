const { app, BrowserWindow, globalShortcut } = require("electron")
const path = require("path")

let mainWindow

function createWindow(){

mainWindow = new BrowserWindow({

width:1200,
height:800,

autoHideMenuBar:true,

fullscreen:true,

alwaysOnTop:true,

kiosk:true,

webPreferences:{
preload:path.join(__dirname,"preload.cjs"),
contextIsolation:true,
nodeIntegration:false
}

})

mainWindow.loadURL("http://localhost:5173")

mainWindow.setMenu(null)

mainWindow.on("closed",()=>{

mainWindow=null

})

}

app.whenReady().then(()=>{

createWindow()

globalShortcut.register("F11",()=>{})
globalShortcut.register("Esc",()=>{})

})

app.on("window-all-closed",()=>{

if(process.platform!=="darwin"){
app.quit()
}

})

app.on("activate",()=>{

if(BrowserWindow.getAllWindows().length===0){
createWindow()
}

})