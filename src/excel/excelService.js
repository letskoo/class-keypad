import ExcelJS from "exceljs"

export async function readExcel(file){

const workbook = new ExcelJS.Workbook()

const data = await file.arrayBuffer()

await workbook.xlsx.load(data)

const sheet = workbook.worksheets[0]

const headers=[]

sheet.getRow(1).eachCell((cell)=>{
headers.push(cell.value)
})

const students=[]

sheet.eachRow((row,index)=>{

if(index===1) return

const name=row.getCell(1).value

if(!name) return

const scores={}

for(let i=2;i<=headers.length;i++){

scores[headers[i-1]]=row.getCell(i).value || 0

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