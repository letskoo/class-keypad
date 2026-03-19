function getLogs(){
return JSON.parse(localStorage.getItem("classLogs") || "[]")
}

function today(){
const d=new Date()
return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")
}

function getAllStudents(){
return JSON.parse(localStorage.getItem("classStudents") || "[]")
}

/* 오늘 참여 */

export function getTodayParticipants(){

const logs=getLogs()
const t=today()

const set=new Set()

logs.forEach(l=>{
if(l.date===t){
set.add(l.student)
}
})

return set.size
}

/* 🔥 오늘 챔피언 */

export function getTodayChampion(){

const logs=getLogs()
const t=today()

const map={}

logs.forEach(l=>{
if(l.date!==t) return
map[l.student]=(map[l.student]||0)+1
})

let max=0
let name=null

Object.keys(map).forEach(s=>{
if(map[s]>max){
max=map[s]
name=s
}
})

return name
}

/* 🔥 주간 챔피언 */

export function getWeekChampion(){

const logs=getLogs()

const map={}

logs.forEach(l=>{
map[l.student]=(map[l.student]||0)+1
})

let max=0
let name=null

Object.keys(map).forEach(s=>{
if(map[s]>max){
max=map[s]
name=s
}
})

return name
}

/* 🔥 참여 부족 학생 (전체 학생 기준) */

export function getEncourageStudents(days=5){

const logs=getLogs()
const students=getAllStudents()

const map={}

students.forEach(s=>{
map[s.name]=0
})

logs.forEach(l=>{
map[l.student]=(map[l.student]||0)+1
})

return Object.keys(map)
.map(name=>({
name,
count:map[name]
}))
.filter(s=>s.count < days)
.sort((a,b)=>a.count-b.count)
.slice(0,5)
}

/* 결석자 */

export function getAbsentees(){

const logs=getLogs()
const students=getAllStudents()
const t=today()

const present=new Set()

logs.forEach(l=>{
if(l.date===t){
present.add(l.student)
}
})

return students
.filter(s=>!present.has(s.name))
.map(s=>({name:s.name}))
}

/* 연속 결석 */

export function getConsecutiveAbsentees(){

const logs=getLogs()
const students=getAllStudents()

const map={}

logs.forEach(l=>{
if(!map[l.student]) map[l.student]=[]
map[l.student].push(l.date)
})

return students.map(s=>{

const dates=map[s.name] || []

let miss=0
let d=new Date()

while(true){

const key =
d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")

if(dates.includes(key)){
break
}else{
miss++
d.setDate(d.getDate()-1)
}
}

return{
name:s.name,
days:miss
}

}).filter(s=>s.days>0)
}

/* 위험 학생 (전체 학생 기준) */

export function getRiskStudents(){

const logs=getLogs()
const students=getAllStudents()

const map={}

students.forEach(s=>{
map[s.name]=0
})

logs.forEach(l=>{
map[l.student]=(map[l.student]||0)+1
})

return Object.keys(map)
.filter(name=>map[name] < 3)
.map(name=>({
name,
type:"참여 부족"
}))
}

/* 참여 TOP (전체 학생 기준) */

export function getParticipationTop(){

const logs=getLogs()
const students=getAllStudents()

const map={}

students.forEach(s=>{
map[s.name]=0
})

logs.forEach(l=>{
map[l.student]=(map[l.student]||0)+1
})

return Object.keys(map)
.map(name=>({
name,
count:map[name]
}))
.sort((a,b)=>b.count-a.count)
.slice(0,5)
}

/* streak */

export function getStreak(name){

const logs=getLogs()

const set=new Set()

logs.forEach(l=>{
if(l.student===name){
set.add(l.date)
}
})

return set.size
}