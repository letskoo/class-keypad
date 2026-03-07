import ExcelJS from "exceljs"

export async function readExcel(file){

const buffer = await file.arrayBuffer()

const workbook = new ExcelJS.Workbook()

await workbook.xlsx.load(buffer)

const sheet = workbook.worksheets[0]

const headers = []

sheet.getRow(1).eachCell((cell)=>{
headers.push(cell.value)
})

const students = []

sheet.eachRow((row,rowNumber)=>{

if(rowNumber===1) return

const name = row.getCell(1).value

if(!name) return

const scores = {}

for(let i=2;i<=headers.length;i++){

const action = headers[i-1]

const value = row.getCell(i).value || 0

scores[action] = Number(value)

}

students.push({
name,
scores
})

})

return{
headers,
students
}

}