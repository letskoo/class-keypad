import { getLevel } from "./levelEngine"
import { getStudents, getActions, saveStudentScores } from "./classData"
import { loadSettings } from "../utils/settings"
import { getRankByScore } from "./rankingEngine"
import { writeLog } from "./logEngine"

function today(){
const d=new Date()
return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")
}

function getDaily(){
return JSON.parse(localStorage.getItem("dailyActions") || "{}")
}

function saveDaily(data){
localStorage.setItem("dailyActions",JSON.stringify(data))
}

function getParticipants(){
return JSON.parse(localStorage.getItem("dailyParticipants") || "[]")
}

function saveParticipants(list){
localStorage.setItem("dailyParticipants",JSON.stringify(list))
}

export function updateScore(student, action){

const day=today()

const settings = loadSettings()
const enabledActions =
settings?.actions?.length ? settings.actions : getActions()

let daily=getDaily()

if(!daily[student.name]) daily[student.name]={}
if(!daily[student.name][day]) daily[student.name][day]=[]

if(daily[student.name][day].includes(action)){
return{
blocked:true
}
}

daily[student.name][day].push(action)
saveDaily(daily)

/* 🔥 핵심 추가 */
writeLog(student, action)

let participants=getParticipants()
if(!participants.includes(student.name)){
participants.push(student.name)
saveParticipants(participants)
}

let base = 1
let bonus = 0
let bonusType = null

const rand=Math.random()

if(rand < 0.03){
bonus += 10
bonusType="JACKPOT!"
}
else if(rand < 0.08){
bonus += 5
bonusType="SUPER BONUS"
}
else if(rand < 0.18){
bonus += 3
bonusType="MINI BONUS"
}

if(
enabledActions.length > 0 &&
daily[student.name][day].length === enabledActions.length
){
const missionBonus = enabledActions.length
bonus += missionBonus
bonusType = `오늘 ${missionBonus}개의 미션을 모두 완료했어요`
}

const beforeRank = getRankByScore(getStudents(), student.name)

student.scores[action] = (student.scores[action] || 0) + base + bonus
student.scoreTotal = Object.values(student.scores).reduce((a,b)=>a+(b||0),0)

const afterRank = getRankByScore(getStudents(), student.name)
const rankUp = beforeRank - afterRank

const beforeLevel = student.level || getLevel(student.scoreTotal - (base+bonus))
const afterLevel = getLevel(student.scoreTotal)

student.level = afterLevel

const levelUp = afterLevel > beforeLevel

updateKings()

saveStudentScores()

return{
bonus,
bonusType,
rankUp,
levelUp,
level:afterLevel
}

}

function updateKings(){

const students = getStudents()

if(!students.length) return

const actions = Object.keys(students[0]?.scores || {})

students.forEach(s=>{
s.kings = []
})

actions.forEach(action=>{

const max = Math.max(...students.map(s=>s.scores[action] || 0))

if(max <= 0) return

students
.filter(s=>(s.scores[action] || 0) === max)
.forEach(king=>{
king.kings = king.kings || []
king.kings.push(action)
})

})

}