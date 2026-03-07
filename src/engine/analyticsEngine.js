import {loadClassData, getStudents} from "./classData"

export function getLogs(){
return JSON.parse(localStorage.getItem("classLogs") || "[]")
}

/* 출석 키워드 */

const ATTENDANCE_KEYWORDS = [
"출석",
"출결",
"등원",
"하원",
"출첵",
"출석체크",
"check",
"attendance"
]

function isAttendanceAction(action){

if(!action) return false

const text = String(action).toLowerCase()

return ATTENDANCE_KEYWORDS.some(k =>
text.includes(k.toLowerCase())
)

}

function pad(n){
return String(n).padStart(2,"0")
}

function today(){
const d=new Date()
return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())
}

function diffDays(dateText){

if(!dateText) return 9999

const [y,m,d] = dateText.split("-").map(Number)

const last = new Date(y,m-1,d)
const now = new Date()

last.setHours(0,0,0,0)
now.setHours(0,0,0,0)

const diff = now - last

return Math.floor(diff / (1000*60*60*24))
}

/* =========================
   오늘 참여 학생
========================= */

export function getTodayParticipants(){

const logs=getLogs()
const t=today()
const set=new Set()

logs.forEach(l=>{

if(l.date===t){

if(!isAttendanceAction(l.action)){
set.add(l.student)
}

}

})

return set.size
}

/* =========================
   오늘 출석만
========================= */

export function getTodayAttendanceOnly(){

loadClassData()

const students = getStudents()
const logs = getLogs()
const t = today()

const map = {}

logs.forEach(l=>{

if(l.date!==t) return

if(!map[l.student]) map[l.student]=[]

map[l.student].push(l.action)

})

const list=[]

students.forEach(s=>{

const actions = map[s.name] || []

if(actions.length===0) return

const hasActivity = actions.some(a=>!isAttendanceAction(a))

if(!hasActivity){
list.push(s.name)
}

})

return list

}

/* =========================
   오늘 결석
========================= */

export function getTodayAbsentees(){

loadClassData()

const students = getStudents()
const logs = getLogs()
const t = today()

const set = new Set()

logs.forEach(l=>{
if(l.date===t){
set.add(l.student)
}
})

return students
.filter(s=>!set.has(s.name))
.map(s=>s.name)

}

/* =========================
   오늘 챔피언
========================= */

export function getTodayChampion(){

const logs=getLogs()
const t=today()
const map={}

logs.forEach(l=>{

if(l.date===t){

if(isAttendanceAction(l.action)) return

if(!map[l.student]) map[l.student]=0
map[l.student]+=1

}

})

let max=0
let champion=null

Object.keys(map).forEach(s=>{
if(map[s]>max){
max=map[s]
champion=s
}
})

return champion

}

/* =========================
   주간 챔피언
========================= */

export function getWeekChampion(){

const logs=getLogs()

const d=new Date()
const day=d.getDay()
d.setDate(d.getDate()-day)

const w=d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())

const map={}

logs.forEach(l=>{

if(l.date>=w){

if(isAttendanceAction(l.action)) return

if(!map[l.student]) map[l.student]=0
map[l.student]+=1

}

})

let max=0
let champion=null

Object.keys(map).forEach(s=>{
if(map[s]>max){
max=map[s]
champion=s
}
})

return champion

}

/* =========================
   마지막 참여
========================= */

export function getLastActivity(){

const logs = getLogs()
const map = {}

logs.forEach(l=>{

if(isAttendanceAction(l.action)) return

map[l.student] = l.date

})

return map

}

/* =========================
   사각지역 학생
========================= */

export function getEncourageStudents(days=5){

loadClassData()

const students = getStudents()
const lastMap = getLastActivity()

return students
.map(s=>{

const lastDate = lastMap[s.name] || null
const passed = diffDays(lastDate)

return {
name:s.name,
days:passed,
lastDate:lastDate
}

})
.filter(s=>s.days >= days)
.sort((a,b)=>b.days-a.days)

}

/* =========================
   연속 결석
========================= */

export function getConsecutiveAbsentees(){

loadClassData()

const students = getStudents()
const logs = getLogs()

const result=[]

students.forEach(s=>{

let streak=0
let d=new Date()

while(true){

const date =
d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())

const hasLog = logs.some(l=>l.student===s.name && l.date===date)

if(!hasLog){
streak++
d.setDate(d.getDate()-1)
}else{
break
}

}

if(streak>0){

result.push({
name:s.name,
days:streak
})

}

})

return result.sort((a,b)=>b.days-a.days)

}

/* =========================
   결석 패턴 (최근 30일)
========================= */

export function getAbsencePattern(studentName){

const logs=getLogs()

const counts={
월:0,
화:0,
수:0,
목:0,
금:0
}

const days=["일","월","화","수","목","금","토"]

const now=new Date()

for(let i=0;i<30;i++){

const d=new Date(now)
d.setDate(now.getDate()-i)

const date =
d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())

const hasLog = logs.some(l=>l.student===studentName && l.date===date)

if(!hasLog){

const dayName=days[d.getDay()]

if(counts[dayName]!==undefined){
counts[dayName]++
}

}

}

const max=Math.max(...Object.values(counts))

if(max===0) return null

const result=Object.keys(counts)
.filter(k=>counts[k]===max)

return result

}

/* =========================
   참여 STREAK
========================= */

export function getStreak(studentName){

const logs=getLogs()

const dates = logs
.filter(l=>l.student===studentName)
.filter(l=>!isAttendanceAction(l.action))
.map(l=>l.date)

const unique=[...new Set(dates)]

unique.sort((a,b)=> new Date(b)-new Date(a))

let streak=0
let current = new Date()

while(true){

const check =
current.getFullYear()+"-"+pad(current.getMonth()+1)+"-"+pad(current.getDate())

if(unique.includes(check)){
streak++
current.setDate(current.getDate()-1)
}else{
break
}

}

return streak

}

/* =========================
   참여 히트맵 (최근 30일)
========================= */

export function getParticipationHeatmap(){

const logs = getLogs()

const days=["일","월","화","수","목","금","토"]

const map={
일:0,
월:0,
화:0,
수:0,
목:0,
금:0,
토:0
}

const now=new Date()

for(let i=0;i<30;i++){

const d=new Date(now)
d.setDate(now.getDate()-i)

const date =
d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())

const participants=new Set()

logs.forEach(l=>{

if(l.date===date){

if(!isAttendanceAction(l.action)){
participants.add(l.student)
}

}

})

const dayName=days[d.getDay()]

map[dayName]+=participants.size

}

return map

}

/* =========================
   참여 TOP 학생
========================= */

export function getParticipationTop(limit=5){

const logs = getLogs()

const map = {}

logs.forEach(l=>{

if(isAttendanceAction(l.action)) return

if(!map[l.student]) map[l.student]=0

map[l.student]++

})

const list = Object.keys(map).map(name=>({
name,
count:map[name]
}))

list.sort((a,b)=>b.count-a.count)

return list.slice(0,limit)

}

/* =========================
   참여 랭킹
========================= */

export function getParticipationRanking(){

const logs = getLogs()

const map = {}

logs.forEach(l=>{

if(isAttendanceAction(l.action)) return

if(!map[l.student]) map[l.student]=0

map[l.student]++

})

const list = Object.keys(map).map(name=>({
name,
count:map[name]
}))

list.sort((a,b)=>b.count-a.count)

return list

}

/* =========================
   학생 참여 그래프 (최근 30일)
========================= */

export function getStudentParticipationGraph(studentName){

const logs = getLogs()

const data=[]

const now=new Date()

for(let i=29;i>=0;i--){

const d=new Date(now)
d.setDate(now.getDate()-i)

const date =
d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())

let count=0

logs.forEach(l=>{

if(l.student===studentName && l.date===date){

if(!isAttendanceAction(l.action)){
count++
}

}

})

data.push({
date,
count
})

}

return data

}

/* =========================
   위험 학생 탐지
========================= */

export function getRiskStudents(){

loadClassData()

const students=getStudents()

const logs=getLogs()

const map={}

logs.forEach(l=>{

if(isAttendanceAction(l.action)) return

if(!map[l.student]) map[l.student]=0

map[l.student]++

})

const result=[]

students.forEach(s=>{

const count = map[s.name] || 0

if(count===0){

result.push({
name:s.name,
type:"참여 없음"
})

}
else if(count<5){

result.push({
name:s.name,
type:"참여 매우 적음"
})

}

})

return result

}