import ExcelJS from "exceljs"
import {getStudents} from "../engine/classData"

function getMonth(){
const d = new Date()
return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")
}

export async function exportScoreExcel(){

const students = getStudents()
const month = getMonth()

const workbook = new ExcelJS.Workbook()
const sheet = workbook.addWorksheet("score")

const headers = ["이름"]

const actions = students[0]?.scores ? Object.keys(students[0].scores) : []

actions.forEach(a=>headers.push(a))

sheet.addRow(headers)

students.forEach(st=>{

const row = [st.name]

actions.forEach(a=>{
row.push(st.scores[a] || 0)
})

sheet.addRow(row)

})

const buffer = await workbook.xlsx.writeBuffer()

download(buffer,`class_score_${month}.xlsx`)

}

export function exportLogExcel(){

const logs = JSON.parse(localStorage.getItem("classLogs") || "[]")
const month = getMonth()

const workbook = new ExcelJS.Workbook()
const sheet = workbook.addWorksheet("log")

sheet.addRow(["date","month","student","action","point"])

logs.forEach(l=>{
sheet.addRow([
l.date,
l.month,
l.student,
l.action,
l.point
])
})

workbook.xlsx.writeBuffer().then(buffer=>{
download(buffer,`class_log_${month}.xlsx`)
})

}

function download(buffer,name){

const blob = new Blob([buffer])
const url = window.URL.createObjectURL(blob)

const a = document.createElement("a")
a.href = url
a.download = name
a.click()

window.URL.revokeObjectURL(url)

}