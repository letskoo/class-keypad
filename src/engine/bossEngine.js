let bossState = null

function today(){
const d=new Date()
return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")
}

export function getBoss(){
const saved = localStorage.getItem("classBoss")
if(!saved) return null
bossState = JSON.parse(saved)
return bossState
}

export function clearBoss(){
bossState=null
localStorage.removeItem("classBoss")
}

export function attackBoss(action,student,students){

bossState = getBoss()
if(!bossState) return {active:false}

bossState.hp -= 10

if(bossState.hp<=0){
clearBoss()
return {defeated:true}
}

localStorage.setItem("classBoss",JSON.stringify(bossState))

return{
active:true,
boss:bossState
}

}