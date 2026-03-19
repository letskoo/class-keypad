let todayMission=null

function rand(arr){
return arr[Math.floor(Math.random()*arr.length)]
}

function missionRule(actions){

const type=Math.floor(Math.random()*4)

if(type===0){
return{type:"specific1",action:rand(actions),count:1,text:"특정 버튼 1회"}
}

if(type===1){
return{type:"any1",count:1,text:"아무 버튼 1회"}
}

if(type===2){
return{type:"any2",count:2,text:"아무 버튼 2회"}
}

return{type:"specific2",action:rand(actions),count:1,text:"특정 버튼 1회"}
}

function saveMission(){
localStorage.setItem("classMission",JSON.stringify(todayMission))
}

function loadMission(){
const saved=localStorage.getItem("classMission")
if(saved){
try{
todayMission=JSON.parse(saved)
}catch(e){
localStorage.removeItem("classMission")
}
}
}

loadMission()

export function generateTeamMission(students=[],actions=[]){

if(!students.length) return null

const sorted=[...students].sort((a,b)=>(b.scoreTotal||0)-(a.scoreTotal||0))

const topCount=Math.max(1,Math.floor(students.length*0.1))
const lowCount=Math.max(1,Math.floor(students.length*0.3))

const top=sorted.slice(0,topCount)
const low=sorted.slice(-lowCount)

const team=[]

team.push(rand(top))

const lowPick=Math.floor(Math.random()*3)+1

for(let i=0;i<lowPick;i++){
team.push(rand(low))
}

const rule=missionRule(actions)

todayMission={
team,
rule,
progress:{},
cleared:false
}

saveMission()

return todayMission
}

export function getTeamMission(){
return todayMission
}

export function clearTeamMission(){
todayMission=null
localStorage.removeItem("classMission")
}

/* 🔥 추가 */

export function tryClearMission(student,action){

if(!todayMission) return false
if(todayMission.cleared) return false

const inTeam = todayMission.team.find(s=>s.name===student.name)

if(!inTeam) return false

if(!todayMission.progress[student.name]){
todayMission.progress[student.name]=0
}

const rule=todayMission.rule

if(rule.type==="any1" || rule.type==="any2"){
todayMission.progress[student.name]++
}

if(rule.type==="specific1" || rule.type==="specific2"){
if(action===rule.action){
todayMission.progress[student.name]++
}
}

if(todayMission.progress[student.name] >= rule.count){

todayMission.cleared=true
saveMission()

return{
success:true
}

}

saveMission()

return false
}