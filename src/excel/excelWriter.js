import ExcelJS from "exceljs"

export async function updateExcelScore(fileHandle, studentName, action, score=1){

try{

if(!fileHandle) return

const file = await fileHandle.getFile()
const buffer = await file.arrayBuffer()

const workbook = new ExcelJS.Workbook()

await workbook.xlsx.load(buffer)

const sheet = workbook.worksheets[0]

let headers=[]

sheet.getRow(1).eachCell((cell,i)=>{
headers[i]=cell.value
})

let actionCol = headers.indexOf(action)

if(actionCol === -1) return

actionCol = actionCol + 1

let targetRow=null

sheet.eachRow((row,i)=>{

if(i===1) return

const name=row.getCell(1).value

if(name===studentName){
targetRow=row
}

})

if(!targetRow) return

const cell = targetRow.getCell(actionCol)

cell.value = (cell.value || 0) + score

const writable = await fileHandle.createWritable()

await workbook.xlsx.write(writable)

await writable.close()

}catch(e){

console.log("excel score write fail",e)

}

}