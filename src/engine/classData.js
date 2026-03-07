import { getLevel } from "./levelEngine"

let students = []
let actions = []

export function setClassData(data){

const headers = data.headers
const rows = data.students

actions = headers.slice(1)

students = rows.map((s,i)=>{

const total = Object.values(s.scores).reduce((a,b)=>a+(b||0),0)

return{
num:i+1,
name:s.name,
scores:s.scores,
scoreTotal:total,
character:getCharacter(s.name),
level:getLevel(total),
kings:[]
}

})

localStorage.setItem("classStudents",JSON.stringify(students))
localStorage.setItem("classActions",JSON.stringify(actions))

}

export function loadClassData(){

const s = localStorage.getItem("classStudents")
const a = localStorage.getItem("classActions")

if(s) students = JSON.parse(s)
if(a) actions = JSON.parse(a)

}

export function getStudents(){
return students
}

export function getActions(){
return actions
}

function getCharacter(name){

const list=["🐯","🐼","🦊","🐵","🐸","🐻","🐧","🐰","🐱"]

let hash=0

for(let i=0;i<name.length;i++){
hash+=name.charCodeAt(i)
}

return list[hash%list.length]

}