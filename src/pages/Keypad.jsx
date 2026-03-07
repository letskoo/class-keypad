import {useState,useEffect} from "react"
import {useNavigate} from "react-router-dom"

import Header from "../components/Header"
import ResultPanel from "../components/ResultPanel"
import PasswordModal from "../components/PasswordModal"
import AdminMenu from "../components/AdminMenu"

import {getStudents,getActions,loadClassData} from "../engine/classData"
import {updateScore} from "../engine/scoreEngine"
import {writeLog} from "../engine/logEngine"
import {
sortStudentsForRanking,
getChampionName,
getScoreDiffFromTop
} from "../engine/rankingEngine"

import {loadSettings} from "../utils/settings"

import {trySpawnBoss,getBoss,attackBoss} from "../engine/bossEngine"

import {updateExcelScore} from "../excel/excelWriter"
import {appendLog} from "../excel/logWriter"

import {
getScoreHandle,
getLogHandle,
restoreDirectoryHandle
} from "../utils/fileSystem"

import "../styles/layout.css"
import "../styles/keypad.css"
import "../styles/classroom.css"

export default function Keypad(){

const navigate = useNavigate()

loadClassData()

const settings = loadSettings()
const actions = settings?.actions?.length ? settings.actions : getActions()

const[input,setInput]=useState("")
const[inputError,setInputError]=useState(false)

const[result,setResult]=useState(null)

const[students,setStudents]=useState([])
const[boss,setBoss]=useState(null)

const[showPassword,setShowPassword]=useState(false)
const[showAdmin,setShowAdmin]=useState(false)

useEffect(()=>{
setStudents([...getStudents()])
},[])

useEffect(()=>{
restoreDirectoryHandle()
},[])

useEffect(()=>{

if(students.length===0) return

const spawned = trySpawnBoss(actions,students)

if(spawned){
setBoss(spawned)
}

},[students])

useEffect(()=>{

if(!result) return

const timer=setTimeout(()=>{
resetInput()
},5000)

return()=>clearTimeout(timer)

},[result])

function openAdmin(){
setShowPassword(true)
}

function passwordSuccess(){
setShowPassword(false)
setShowAdmin(true)
}

function openDashboard(){
navigate("/dashboard")
}

function exitApp(){
window.close()
}

function resetInput(){
setResult(null)
setInput("")
}

/* 숫자 입력 */

function press(n){

if(result) return

if(n==="DEL"){
setInput(input.slice(0,-1))
return
}

/* 숫자만 허용 */

if(!/^[0-9]$/.test(n)) return

/* 길이 제한 */

if(input.length>=6) return

setInput(input+n)

}

function cancelInput(){
setInput("")
}

/* 점수 버튼 */

async function pressAction(action){

/* 숫자 검증 */

if(!/^\d+$/.test(input)){
setInputError(true)
setTimeout(()=>setInputError(false),400)
return
}

if(!input){
setInputError(true)
setTimeout(()=>setInputError(false),400)
return
}

/* 학생 찾기 */

const s = students.find(st=>String(st.num)===input)

if(!s){
setInputError(true)
setTimeout(()=>setInputError(false),400)
return
}

const beforeChampion = getChampionName(students)

const engineResult = updateScore(s,action)

if(engineResult?.blocked){

setResult({
student:s,
action,
score:s.scoreTotal,
diff:0,
message:"오늘 이미 누른 버튼입니다.",
bonus:0,
bonusType:null,
rankUp:0,
levelUp:false,
level:s.level
})

return
}

const bossResult = attackBoss(action,s,students)

if(bossResult?.defeated){

students.forEach(st=>{
writeLog(st,"BOSS_REWARD")
})

setBoss(null)

setResult({
student:s,
action,
score:s.scoreTotal,
diff:0,
message:"보스 처치! 전원 +5 보너스",
bonus:5,
bonusType:"BOSS BONUS",
rankUp:0,
levelUp:false,
level:s.level
})

setStudents([...students])
return
}

setBoss(getBoss())

writeLog(s,action)

try{

const scoreHandle = getScoreHandle()
const logHandle = getLogHandle()

if(scoreHandle){
await updateExcelScore(scoreHandle,s.name,action)
}

if(logHandle){
await appendLog(logHandle,s,action)
}

}catch(e){
console.log("excel save error",e)
}

const newScore = s.scoreTotal
const currentChampion = getChampionName(students)
const diff = getScoreDiffFromTop(students,s.name)

let message="좋아요! 계속 도전하세요!"

if(currentChampion===s.name && beforeChampion!==s.name){
message="새로운 챔피언 등장!"
}else if(diff===0){
message="현재 챔피언입니다!"
}else if(diff===1){
message="1점 차이!"
}else if(diff<=3){
message="거의 따라왔어요!"
}else if(diff<=5){
message="조금만 더!"
}

setStudents([...students])

setResult({
student:s,
action,
score:newScore,
diff,
message,
bonus:engineResult.bonus,
bonusType:engineResult.bonusType,
rankUp:engineResult.rankUp,
levelUp:engineResult.levelUp,
level:engineResult.level
})

}

const top5=sortStudentsForRanking(students).slice(0,5)

return(

<div>

<Header onAdminClick={openAdmin}/>

<div className="appLayout">

<div className="leftPanel">

<ResultPanel
top5={top5}
result={result}
boss={boss}
onConfirm={resetInput}
/>

</div>

<div className="rightPanel">

<h2 className="inputTitle">
출결 번호를 입력해 주세요
</h2>

<input
className={`numberInput ${inputError ? "inputError" : ""}`}
value={input}
readOnly
/>

<div className="keypadGrid">

<button onClick={()=>press("1")}>1</button>
<button onClick={()=>press("2")}>2</button>
<button onClick={()=>press("3")}>3</button>

<button onClick={()=>press("4")}>4</button>
<button onClick={()=>press("5")}>5</button>
<button onClick={()=>press("6")}>6</button>

<button onClick={()=>press("7")}>7</button>
<button onClick={()=>press("8")}>8</button>
<button onClick={()=>press("9")}>9</button>

<button onClick={()=>press("DEL")}>⌫</button>
<button onClick={()=>press("0")}>0</button>
<button onClick={cancelInput}>초기화</button>

</div>

<div className="actionGrid">

{actions.map((a,i)=>(
<button
key={i}
onClick={()=>pressAction(a)}
>
{a}
</button>
))}

</div>

</div>

</div>

{showPassword && (
<PasswordModal
onSuccess={passwordSuccess}
onClose={()=>setShowPassword(false)}
/>
)}

{showAdmin && (
<AdminMenu
onDashboard={openDashboard}
onExit={exitApp}
onClose={()=>setShowAdmin(false)}
/>
)}

</div>

)

}