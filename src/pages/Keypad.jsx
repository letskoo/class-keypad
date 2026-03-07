import {useState,useEffect,useRef} from "react"
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
getScoreDiffFromTop
} from "../engine/rankingEngine"

import {loadSettings} from "../utils/settings"

import {
trySpawnBoss,
attackBoss,
clearBoss,
getBoss
} from "../engine/bossEngine"

import {autoGenerateMission,tryClearMission} from "../engine/teamMissionEngine"

import {updateExcelScore} from "../excel/excelWriter"
import {appendLog} from "../excel/logWriter"

import {
getScoreHandle,
getLogHandle,
restoreDirectoryHandle
} from "../utils/fileSystem"

import {initPWAInstall} from "../utils/pwaInstall"
import {speakAction} from "../engine/messageEngine"

/* CSS */
import "../styles/layout.css"
import "../styles/keypad.css"
import "../styles/classroom.css"

export default function Keypad(){

const navigate = useNavigate()

const[students,setStudents]=useState([])
const[actions,setActions]=useState([])

const[input,setInput]=useState("")
const[inputError,setInputError]=useState(false)

const[result,setResult]=useState(null)
const[boss,setBoss]=useState(null)

const[showPassword,setShowPassword]=useState(false)
const[showAdmin,setShowAdmin]=useState(false)

const actionLock = useRef(false)
const idleTimer = useRef(null)

/* 초기화 */

useEffect(()=>{

loadClassData()

setStudents([...getStudents()])
setActions([...getActions()])

restoreDirectoryHandle()
initPWAInstall()

const savedBoss = getBoss()

if(savedBoss){
setBoss(savedBoss)
}

},[])

const settings = loadSettings()

const actionList = settings?.actions?.length ? settings.actions : actions

/* 팀 미션 자동 생성 */

useEffect(()=>{
if(students.length){
autoGenerateMission(students)
}
},[students])

/* 보스 생성 */

useEffect(()=>{

if(students.length===0) return
if(boss) return

const spawned = trySpawnBoss(actionList,students)

if(spawned){
setBoss(spawned)
}

},[students])

/* 결과 자동 초기화 */

useEffect(()=>{

if(!result) return

const timer=setTimeout(()=>{
resetInput()
},5000)

return()=>clearTimeout(timer)

},[result])

/* 숫자 자동 초기화 */

useEffect(()=>{

if(!input) return

clearTimeout(idleTimer.current)

idleTimer.current=setTimeout(()=>{
setInput("")
},5000)

return ()=>clearTimeout(idleTimer.current)

},[input])

function openAdmin(){
setShowPassword(true)
}

function passwordSuccess(){
setShowPassword(false)
setShowAdmin(true)
}

function openDashboard(){
setShowAdmin(false)
navigate("/dashboard")
}

function exitApp(){
window.close()
}

function resetInput(){

setResult(null)
setInput("")
actionLock.current=false

}

/* 숫자 입력 */

function press(n){

if(result) return
if(actionLock.current) return

if(n==="DEL"){
setInput(input.slice(0,-1))
return
}

if(!/^[0-9]$/.test(n)) return
if(input.length>=6) return

setInput(input+n)

}

function cancelInput(){
if(actionLock.current) return
setInput("")
}

/* 버튼 */

async function pressAction(action){

if(actionLock.current) return
if(result) return

actionLock.current=true

if(!/^\d+$/.test(input)){
setInputError(true)
setTimeout(()=>setInputError(false),400)
actionLock.current=false
return
}

const s = students.find(st=>String(st.num)===input)

if(!s){
setInputError(true)
setTimeout(()=>setInputError(false),400)
actionLock.current=false
return
}

/* 보스 공격 */

if(boss){

const bossResult = attackBoss(action,s,students)

if(bossResult?.boss){

setBoss(bossResult.boss)
setInput("")
actionLock.current=false
return

}

if(bossResult?.defeated){

students.forEach(st=>{
writeLog(st,"BOSS_REWARD")
})

clearBoss()
setBoss(null)

setStudents([...students])

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

setInput("")
return
}

}

/* 일반 점수 */

const engineResult = updateScore(s,action)

writeLog(s,action)

speakAction(action)

/* 팀미션 체크 */

const missionClear = tryClearMission(s)

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
const diff = getScoreDiffFromTop(students,s.name)

setStudents([...students])

let msg="좋아요! 계속 도전하세요"

if(engineResult?.blocked){
msg="이미 누른 항목입니다"
}

if(missionClear){
msg="팀 미션 성공! 보너스!"
}

setResult({
student:s,
action,
score:newScore,
diff,
message:msg,
bonus:engineResult?.bonus || 0,
bonusType:engineResult?.bonusType,
rankUp:engineResult?.rankUp || 0,
levelUp:engineResult?.levelUp,
level:engineResult?.level
})

setInput("")
actionLock.current=false

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

{actionList.map((a,i)=>(

<button key={i} onClick={()=>pressAction(a)}>
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