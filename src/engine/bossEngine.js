let bossState = null

function today(){
const d=new Date()
return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()
}

/* =========================
   참여율 계산
========================= */

function getParticipationRate(){

const logs = JSON.parse(localStorage.getItem("classLogs") || "[]")
const students = JSON.parse(localStorage.getItem("classStudents") || "[]")

const todayDate = today()

const set = new Set()

logs.forEach(l=>{
if(l.date===todayDate){
set.add(l.student)
}
})

if(students.length===0) return 0

return set.size / students.length

}

/* =========================
   보스 조회
========================= */

export function getBoss(){

if(!bossState){

const saved = localStorage.getItem("classBoss")

if(saved){
bossState = JSON.parse(saved)

/* 날짜 지나면 삭제 */

if(bossState.spawnDate !== today()){
clearBoss()
return null
}

}

}

return bossState

}

/* =========================
   보스 제거
========================= */

export function clearBoss(){
bossState = null
localStorage.removeItem("classBoss")
}

/* =========================
   AI 보스 생성
========================= */

export function trySpawnBoss(actions,students){

if(bossState) return bossState

if(!actions || actions.length===0) return null
if(!students || students.length===0) return null

const rate = getParticipationRate()

let spawnChance = 0.05

if(rate < 0.3) spawnChance = 0.15
else if(rate < 0.5) spawnChance = 0.1

const rand=Math.random()

if(rand>spawnChance) return null

const typeRand=Math.random()

/* =========================
   학생 보스
========================= */

if(typeRand<0.5){

const s = students[Math.floor(Math.random()*students.length)]

if(!s) return null

bossState={
type:"student",
name:s.name,
spawnDate:today()
}

localStorage.setItem("classBoss",JSON.stringify(bossState))

return bossState
}

/* =========================
   몬스터 보스
========================= */

const action = actions[Math.floor(Math.random()*actions.length)]

if(!action) return null

let hp = 100

if(rate < 0.3) hp = 50
else if(rate < 0.5) hp = 80
else if(rate > 0.8) hp = 150

bossState={
type:"monster",
action:action,
hp:hp,
maxHp:hp,
spawnDate:today()
}

localStorage.setItem("classBoss",JSON.stringify(bossState))

return bossState

}

/* =========================
   보스 공격
========================= */

export function attackBoss(action,student,students){

if(!bossState) return {active:false}

/* 몬스터 보스 */

if(bossState.type==="monster"){

if(bossState.action!==action){
return {active:true}
}

bossState.hp -= 10

if(bossState.hp<=0){

clearBoss()

students.forEach(s=>{
s.scoreTotal+=5
})

return{
defeated:true,
type:"monster"
}

}

return{
active:true,
hp:bossState.hp,
maxHp:bossState.maxHp
}

}

/* =========================
   학생 보스
========================= */

if(bossState.type==="student"){

if(student.name===bossState.name){
return {active:true}
}

const bossStudent=students.find(s=>s.name===bossState.name)

if(!bossStudent){
clearBoss()
return {active:false}
}

if(student.scoreTotal>bossStudent.scoreTotal){

clearBoss()

students.forEach(s=>{
s.scoreTotal+=5
})

return{
defeated:true,
type:"student"
}

}

}

return {active:true}

}