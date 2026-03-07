import ExcelJS from "exceljs"

export async function appendLog(fileHandle,student,action){

try{

if(!fileHandle) return

const file = await fileHandle.getFile()

const buffer = await file.arrayBuffer()

const workbook = new ExcelJS.Workbook()

await workbook.xlsx.load(buffer)

const sheet = workbook.worksheets[0]

const now=new Date()

const date=
now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,"0")+"-"+String(now.getDate()).padStart(2,"0")

const month=
now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,"0")

sheet.addRow([
date,
month,
student.name,
action,
1
])

const writable=await fileHandle.createWritable()

await workbook.xlsx.write(writable)

await writable.close()

}catch(e){

console.log("excel log write fail",e)

}

}