const fs = require("fs")
const path = require("path")
const os = require("os")

function ensureSystem(){

const documents = path.join(os.homedir(),"Documents")
const root = path.join(documents,"class-system")

const scoreDir = path.join(root,"score")
const logDir = path.join(root,"logs")

if(!fs.existsSync(root)){
fs.mkdirSync(root)
}

if(!fs.existsSync(scoreDir)){
fs.mkdirSync(scoreDir)
}

if(!fs.existsSync(logDir)){
fs.mkdirSync(logDir)
}

const now = new Date()
const month = now.toISOString().slice(0,7)

const scoreFile = path.join(scoreDir,`class_score_${month}.xlsx`)
const logFile = path.join(logDir,"class_log.xlsx")

if(!fs.existsSync(scoreFile)){
fs.writeFileSync(scoreFile,"")
}

if(!fs.existsSync(logFile)){
fs.writeFileSync(logFile,"")
}

return {
root,
scoreFile,
logFile
}

}

module.exports = {ensureSystem}