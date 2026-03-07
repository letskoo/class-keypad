let bossState = null

function today(){
const d=new Date()
return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()
}

export function getBoss(){

const saved = localStorage.getItem("classBoss")

if(!saved) return null

bossState = JSON.parse(saved)

if(bossState.spawnDate !== today()){
clearBoss()
return null
}

return bossState
}

export function clearBoss(){
bossState=null
localStorage.removeItem("classBoss")
}

export function trySpawnBoss(actions,students){

const existing = getBoss()

if(existing) return existing

if(!actions?.length) return null
if(!students?.length) return null

if(Math.random()>0.05) return null

const action = actions[Math.floor(Math.random()*actions.length)]

bossState={
type:"monster",
action,
hp:100,
maxHp:100,
spawnDate:today()
}

localStorage.setItem("classBoss",JSON.stringify(bossState))

return bossState
}

export function attackBoss(action,student,students){

bossState = getBoss()

if(!bossState) return {active:false}

if(bossState.action!==action){
return {active:true,boss:bossState}
}

bossState.hp -= 10

if(bossState.hp<=0){

students.forEach(s=>{
s.scoreTotal += 5
})

clearBoss()

return {defeated:true}

}

localStorage.setItem("classBoss",JSON.stringify(bossState))

return{
active:true,
boss:bossState
}

}