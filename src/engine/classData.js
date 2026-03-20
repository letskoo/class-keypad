let students = []
let actions = []

const CHARACTERS=[
"🐶","🐱","🐭","🐹","🐰",
"🦊","🐻","🐼","🐯","🦁",
"🐨","🐸","🐵","🐧","🐤",
"🐙","🦄","🐲","🐳","🐬"
]

function randomCharacter(){
return CHARACTERS[Math.floor(Math.random()*CHARACTERS.length)]
}

function saveStudents(){
localStorage.setItem("classStudents",JSON.stringify(students))
}

function normalizeStudents(list){

return (list || []).map((s,index)=>{

if(!s.num){
s.num = index + 1
}

if(!s.character){
s.character = randomCharacter()
}

if(!s.scores){
s.scores = {}
}

if(!s.scoreTotal){
const values = Object.values(s.scores)
s.scoreTotal = values.length ? values.reduce((a,b)=>a+(b||0),0) : 0
}

if(!s.level){
s.level = 1
}

return s

})

}

function loadStudents(){

const saved = localStorage.getItem("classStudents")

if(saved){

try{
students = normalizeStudents(JSON.parse(saved))
return
}catch(e){
console.log("classStudents parse fail reset")
localStorage.removeItem("classStudents")
}

}

const data = JSON.parse(localStorage.getItem("classData") || "{}")

students = normalizeStudents(data.students || [])

}

export function loadClassData(){

loadStudents()

const data = JSON.parse(localStorage.getItem("classData") || "{}")

actions = data.actions || []

}

export function setClassData(data){

students = normalizeStudents(data.students || [])
actions = data.actions || []

localStorage.setItem("classData",JSON.stringify({
students,
actions
}))

saveStudents()

}

export function getStudents(){
return students
}

export function getActions(){
return actions
}

export function saveStudentScores(){
saveStudents()
}

/* 🔥 전체 초기화 (학생 + 점수 + 번호 + 로그 포함) */
export function resetAllStudents(){

localStorage.removeItem("classStudents")
localStorage.removeItem("classLogs")
localStorage.removeItem("dailyActions")
localStorage.removeItem("dailyParticipants")

const data = JSON.parse(localStorage.getItem("classData") || "{}")

students = normalizeStudents((data.students || []).map((s,index)=>({
...s,
num:index+1,
scores:{},
scoreTotal:0,
level:1
})))

saveStudents()

return true
}