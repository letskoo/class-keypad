import {useState,useEffect,useRef} from "react"
import {useNavigate} from "react-router-dom"

import Header from "../components/Header"
import ResultPanel from "../components/ResultPanel"
import PasswordModal from "../components/PasswordModal"
import AdminMenu from "../components/AdminMenu"

import {getStudents,getActions,loadClassData} from "../engine/classData"
import {updateScore} from "../engine/scoreEngine"
import {speakAction} from "../engine/messageEngine"

import {loadSettings} from "../utils/settings"

import {
sortStudentsForRanking
} from "../engine/rankingEngine"

import {
attackBoss,
getBoss
} from "../engine/bossEngine"

import {tryClearMission} from "../engine/teamMissionEngine"

import "../styles/layout.css"
import "../styles/keypad.css"
import "../styles/classroom.css"

export default function Keypad(){

const navigate = useNavigate()

const[students,setStudents]=useState([])
const[actions,setActions]=useState([])

const[input,setInput]=useState("")
const[result,setResult]=useState(null)

const[boss,setBoss]=useState(null)
const[mission,setMission]=useState(null)
const[rival,setRival]=useState(null)

const[showPassword,setShowPassword]=useState(false)
const[showMenu,setShowMenu]=useState(false)

const actionLock = useRef(false)
const clickLock = useRef(false)
const inputTimer = useRef(null)

useEffect(()=>{

loadClassData()

setStudents([...getStudents()])
setActions([...getActions()])

const savedBoss = getBoss()
if(savedBoss) setBoss(savedBoss)

const savedRival = localStorage.getItem("classRival")
if(savedRival) setRival(JSON.parse(savedRival))

const savedMission = localStorage.getItem("classMission")
if(savedMission) setMission(JSON.parse(savedMission))

},[])

useEffect(()=>{
if(!input) return
if(inputTimer.current) clearTimeout(inputTimer.current)
inputTimer.current=setTimeout(()=>setInput(""),5000)
return ()=>clearTimeout(inputTimer.current)
},[input])

useEffect(()=>{
if(result){
const t=setTimeout(()=>setResult(null),7000)
return ()=>clearTimeout(t)
}
},[result])

const actionList = loadSettings()?.actions?.length ? loadSettings().actions : actions

function handleConfirm(){
setResult(null)
}

function press(n){

if(result) return

if(clickLock.current) return
clickLock.current=true
setTimeout(()=>clickLock.current=false,200)

if(n==="DEL"){setInput(input.slice(0,-1));return}
if(n==="CLEAR"){setInput("");return}

if(input.length>=4) return

setInput(input+n)
}

function pressAction(action){

if(result) return
if(!input) return

if(actionLock.current) return
actionLock.current=true
setTimeout(()=>actionLock.current=false,300)

const s = students.find(st=>String(st.num)===input)

if(!s){
setResult({message:"등록되지 않은 번호"})
setInput("")
return
}

const res = updateScore(s,action)

if(res?.blocked){

speakAction("이미 수행한 버튼입니다")

setResult({
student:s,
action,
message:"이미 수행한 버튼입니다",
score:s.scoreTotal,
level:s.level
})

setInput("")
return
}

speakAction(`${action} 점수가 올라갑니다`)

const missionResult = tryClearMission(s,action)

if(missionResult?.success){
setMission(null)
setResult({
student:s,
action,
message:"팀미션 성공!",
score:s.scoreTotal,
level:s.level
})
setStudents([...students])
setInput("")
return
}

if(boss){
const bossRes = attackBoss(action,s,students)
if(bossRes?.active) setBoss({...bossRes.boss})
if(bossRes?.defeated) setBoss(null)
}

setResult({
student:s,
action,
bonus:res?.bonus || 0,
bonusType:res?.bonusType,
levelUp:res?.levelUp,
rankUp:res?.rankUp,
level:res?.level,
score:s.scoreTotal,
message:"성공"
})

setStudents([...students])
setInput("")
}

const allStudents = sortStudentsForRanking(students)

return(
<div>

<Header onAdminClick={()=>setShowPassword(true)}/>

{showPassword && (
<PasswordModal
onSuccess={()=>{setShowPassword(false);setShowMenu(true)}}
onClose={()=>setShowPassword(false)}
/>
)}

{showMenu && (
<AdminMenu
onDashboard={()=>navigate("/dashboard")}
onExit={()=>window.close()}
onClose={()=>setShowMenu(false)}
/>
)}

<div className="appLayout">

<div className="leftPanel">
<ResultPanel
top5={allStudents}
result={result}
boss={boss}
mission={mission}
rival={rival}
onConfirm={handleConfirm}
/>
</div>

<div className="rightPanel">

<div className="inputTitle">
번호를 입력해 주세요
<div style={{fontSize:"16px",color:"#777",marginTop:"8px"}}>
학생번호를 누른 후 버튼을 누르세요
</div>
</div>

<div className="pinDisplay">
{[0,1,2,3].map((_,i)=>{

const index = input.length - (3 - i) - 1
const value = index >= 0 ? input[index] : ""

return(
<div
key={i}
style={{
width:"80px",
height:"80px",
display:"flex",
alignItems:"center",
justifyContent:"center",
fontSize:"42px",
fontWeight:"800",
color:"#222"
}}
>
{value || <div style={{
width:"12px",
height:"12px",
borderRadius:"50%",
background:"#ddd"
}} />}
</div>
)

})}
</div>

<div className="keypadNew">
{[1,2,3,4,5,6,7,8,9].map(n=>(
<button key={n} onClick={()=>press(String(n))}>{n}</button>
))}

<button onClick={()=>press("DEL")}>⌫</button>
<button onClick={()=>press("0")}>0</button>
<button onClick={()=>press("CLEAR")} className="clearBtn">초기화</button>
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

</div>
)
}