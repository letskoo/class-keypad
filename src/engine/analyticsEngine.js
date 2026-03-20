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

/* 🔥 출결 키워드 (모든 케이스 대응) */
const ABSENT_KEYWORDS = ["결석","출결","미참","결석처리"]

function isAbsent(action){
if(!action) return false
return ABSENT_KEYWORDS.some(k=>action.includes(k))
}

/* 날짜 범위 */
function getLast30Days(){
const arr=[]
const d=new Date()

for(let i=0;i<30;i++){
const tmp=new Date(d)
tmp.setDate(d.getDate()-i)

arr.push(
tmp.getFullYear()+"-"+String(tmp.getMonth()+1).padStart(2,"0")+"-"+String(tmp.getDate()).padStart(2,"0")
)
}

return arr
}

/* 오늘 참여 */
export function getTodayParticipants(){

const logs=getLogs()
const t=today()
const set=new Set()

logs.forEach(l=>{
if(l.date===t && l.action !== "AUTO_ATTENDANCE"){
set.add(l.student)
}
})

return set.size
}

/* 참여 학생 */
export function getTodayPresentStudents(){

const logs=getLogs()
const t=today()
const set=new Set()

logs.forEach(l=>{
if(l.date===t && l.action !== "AUTO_ATTENDANCE"){
set.add(l.student)
}
})

return Array.from(set)
}

/* 🔥 오늘 결석 */
export function getTodayAbsentees(){

const logs=getLogs()
const t=today()

const hasKeyword = logs.some(l=>isAbsent(l.action))
if(!hasKeyword) return null

const set=new Set()

logs.forEach(l=>{
if(l.date===t && isAbsent(l.action)){
set.add(l.student)
}
})

return Array.from(set)
}

/* 🔥 연속 결석 (3/5/7) */
export function getConsecutiveAbsent(){

const logs=getLogs()
const students=getAllStudents()

if(logs.length < 10) return null

const map={}

logs.forEach(l=>{
if(isAbsent(l.action)){
if(!map[l.student]) map[l.student]=[]
map[l.student].push(l.date)
}
})

const result={3:[],5:[],7:[]}

students.forEach(s=>{

const dates=map[s.name]||[]

let count=0
let d=new Date()

while(true){

const key =
d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")

if(dates.includes(key)){
count++
d.setDate(d.getDate()-1)
}else break
}

if(count>=7) result[7].push(s.name)
else if(count>=5) result[5].push(s.name)
else if(count>=3) result[3].push(s.name)

})

return result
}

/* 🔥 요일 패턴 (최근 30일) */
export function getAbsentPatterns(){

const logs=getLogs()
const days=getLast30Days()

if(logs.length < 10) return null

const map=[0,0,0,0,0,0,0]

logs.forEach(l=>{
if(!isAbsent(l.action)) return
if(!days.includes(l.date)) return

const d=new Date(l.date).getDay()
map[d]++
})

return map
}

/* 🔥 오늘 요약 */
export function getTodaySummary(){

const total = getAllStudents().length
const present = getTodayParticipants()
const absentList = getTodayAbsentees()

return{
total,
present,
absent: absentList===null ? null : absentList.length,
absentList,
nonParticipants: total - present
}
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

/* 🔥 위험도 점수 계산 */
export function getRiskAnalysis(){

const logs = JSON.parse(localStorage.getItem("classLogs") || "[]")
const students = JSON.parse(localStorage.getItem("classStudents") || "[]")

if(logs.length < 10){
return null
}

const todayDate = new Date()

return students.map(s=>{

const userLogs = logs.filter(l=>l.student===s.name && l.action!=="AUTO_ATTENDANCE")

/* 참여율 */
const participation = userLogs.length

/* 최근 활동 */
let lastDate = userLogs.length ? userLogs[userLogs.length-1].date : null
let inactiveDays = lastDate
? Math.floor((todayDate - new Date(lastDate))/(1000*60*60*24))
: 999

/* 점수 */
const score = s.scoreTotal || 0

/* 행동 다양성 */
const variety = Object.keys(s.scores||{}).length

/* 위험도 계산 */
let risk = 0

if(participation < 5) risk += 2
if(inactiveDays >= 3) risk += 3
if(score < 10) risk += 2
if(variety <= 1) risk += 1

/* 단계 */
let level="LOW"
if(risk>=6) level="HIGH"
else if(risk>=3) level="MEDIUM"

/* 추천 */
let action="유지"

if(level==="HIGH"){
action="즉시 개입 (칭찬 + 미션)"
}
else if(level==="MEDIUM"){
action="관찰 필요 (팀 배치)"
}
else{
action="유지 / 강화"
}

return{
name:s.name,
risk,
level,
action,
inactiveDays,
score,
variety
}

}).sort((a,b)=>b.risk-a.risk)

}