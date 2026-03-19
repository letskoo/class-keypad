function today(){
const d=new Date()
return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")
}

function getDaily(){
return JSON.parse(localStorage.getItem("dailyActions") || "{}")
}

function rand(arr){
return arr[Math.floor(Math.random()*arr.length)]
}

function saveRival(){
localStorage.setItem("classRival",JSON.stringify(rival))
}

function loadRival(){
const saved=localStorage.getItem("classRival")
if(saved){
try{
rival=JSON.parse(saved)
}catch(e){
localStorage.removeItem("classRival")
}
}
}

let rival=null

loadRival()

export function generateRival(students=[]){

if(!students.length) return null

const sorted=[...students].sort((a,b)=>(b.scoreTotal||0)-(a.scoreTotal||0))

const candidates=sorted.slice(0,5)

rival={
student:rand(candidates),
targetCount:Math.floor(Math.random()*3)+1,
cleared:false
}

saveRival()

return rival

}

export function getRival(){
return rival
}

export function checkRival(student){

if(!rival) return null
if(rival.cleared) return null

const day=today()
const daily=getDaily()

const myCount=(daily?.[student.name]?.[day] || []).length
const rivalCount=(daily?.[rival.student.name]?.[day] || []).length

if(myCount>rivalCount){

rival.cleared=true

saveRival()

return{
win:true,
bonus:3,
rival:rival.student
}

}

return{
win:false,
need:rivalCount-myCount+1,
rival:rival.student
}

}