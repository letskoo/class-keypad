let scoreHandle = null
let logHandle = null

/* 핸들 반환 */

export function getScoreHandle(){
return scoreHandle
}

export function getLogHandle(){
return logHandle
}

/* 폴더 선택 */

export async function selectClassFolder(){

const dir = await window.showDirectoryPicker()

/* 권한 요청 */

const permission = await dir.requestPermission({mode:"readwrite"})

if(permission !== "granted") return

/* 핸들 저장 */

await saveDirectoryHandle(dir)

/* 파일 스캔 */

await scanDirectory(dir)

}

/* 폴더 스캔 */

async function scanDirectory(dir){

scoreHandle = null
logHandle = null

for await (const [name,handle] of dir.entries()){

if(handle.kind !== "directory") continue

/* score 폴더 */

if(name === "score"){

for await (const [fileName,fileHandle] of handle.entries()){

if(fileName.startsWith("class_score") && fileName.endsWith(".xlsx")){
scoreHandle = fileHandle
}

}

}

/* logs 폴더 */

if(name === "logs"){

for await (const [fileName,fileHandle] of handle.entries()){

if(fileName === "class_log.xlsx"){
logHandle = fileHandle
}

}

}

}

}

/* IndexedDB 저장 */

async function saveDirectoryHandle(dir){

const db = await openDB()

const tx = db.transaction("handles","readwrite")

tx.objectStore("handles").put(dir,"class-system")

}

/* 자동 복구 */

export async function restoreDirectoryHandle(){

try{

const db = await openDB()

const tx = db.transaction("handles","readonly")

const dir = await tx.objectStore("handles").get("class-system")

if(!dir) return

/* 권한 확인 */

let permission = await dir.queryPermission({mode:"readwrite"})

if(permission !== "granted"){

permission = await dir.requestPermission({mode:"readwrite"})

if(permission !== "granted") return

}

await scanDirectory(dir)

}catch(e){

console.log("directory restore fail",e)

}

}

/* IndexedDB */

function openDB(){

return new Promise((resolve,reject)=>{

const req = indexedDB.open("class-system-db",1)

req.onupgradeneeded = () => {

const db = req.result

if(!db.objectStoreNames.contains("handles")){
db.createObjectStore("handles")
}

}

req.onsuccess = () => resolve(req.result)

req.onerror = reject

})

}