let todayMission=null

function rand(arr){
return arr[Math.floor(Math.random()*arr.length)]
}

export function generateTeamMission(students=[]){

if(!students.length) return null

const sorted=[...students].sort((a,b)=>(b.scoreTotal||0)-(a.scoreTotal||0))

const top=sorted.slice(0,3)
const low=sorted.slice(-5)

const team=[]

team.push(rand(top))

const lowCount=Math.floor(Math.random()*3)+1

for(let i=0;i<lowCount;i++){
team.push(rand(low))
}

todayMission={
team,
cleared:false
}

return todayMission

}

export function getTeamMission(){
return todayMission
}

export function clearTeamMission(){
todayMission=null
}

export function tryClearMission(student){

if(!todayMission) return false
if(todayMission.cleared) return false

const ok=todayMission.team.find(s=>s.name===student.name)

if(ok){
todayMission.cleared=true
return true
}

return false

}

/* 자동 생성 */

export function autoGenerateMission(students){

if(!todayMission){
todayMission=generateTeamMission(students)
}

return todayMission

}