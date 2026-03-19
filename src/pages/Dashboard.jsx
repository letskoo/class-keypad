import {useEffect,useState} from "react"
import {useNavigate} from "react-router-dom"

import ExcelUpload from "../components/ExcelUpload"
import PasswordSettings from "../components/PasswordSettings"

import {
getTodayParticipants,
getTodayChampion,
getWeekChampion,
getEncourageStudents,
getConsecutiveAbsentees,
getRiskStudents,
getParticipationTop
} from "../engine/analyticsEngine"

import {exportScoreExcel,exportLogExcel} from "../excel/exportExcel"

import {loadSettings,saveSettings} from "../utils/settings"

import {getTeacherRecommendations} from "../engine/teacherAIEngine"

import {getStudents,getActions} from "../engine/classData"
import {generateRival} from "../engine/rivalEngine"
import {generateTeamMission} from "../engine/teamMissionEngine"

export default function Dashboard(){

const navigate=useNavigate()

const[participants,setParticipants]=useState(0)
const[todayChampion,setTodayChampion]=useState(null)
const[weekChampion,setWeekChampion]=useState(null)

const[encourage,setEncourage]=useState([])
const[absent,setAbsent]=useState([])
const[risk,setRisk]=useState([])
const[top,setTop]=useState([])

const[headers,setHeaders]=useState([])
const[selected,setSelected]=useState([])

const[ai,setAi]=useState([])

useEffect(()=>{

setParticipants(getTodayParticipants())
setTodayChampion(getTodayChampion())
setWeekChampion(getWeekChampion())

setEncourage(getEncourageStudents(5))
setAbsent(getConsecutiveAbsentees())
setRisk(getRiskStudents())
setTop(getParticipationTop())

setAi(getTeacherRecommendations())

const settings = loadSettings()

if(settings?.actions){
setSelected(settings.actions)
}

},[])

function onExcelLoaded(data){
if(!data?.headers) return
const list=data.headers.slice(1)
setHeaders(list)
if(selected.length===0){
setSelected(list)
}
}

function toggleAction(action){
if(selected.includes(action)){
setSelected(selected.filter(a=>a!==action))
}else{
setSelected([...selected,action])
}
}

function saveActions(){
saveSettings({actions:selected})
alert("저장 완료")
}

/* 🔥 이벤트 시스템 */

function clearAllEvents(){
localStorage.removeItem("classBoss")
localStorage.removeItem("classRival")
localStorage.removeItem("classMission")
alert("이벤트 초기화 완료")
}

function forceBoss(){
const a=getActions()

localStorage.removeItem("classRival")
localStorage.removeItem("classMission")

const boss={
type:"monster",
action:a[Math.floor(Math.random()*a.length)],
hp:100,
maxHp:100,
spawnDate:new Date().toISOString().slice(0,10)
}

localStorage.setItem("classBoss",JSON.stringify(boss))
alert("보스 생성 완료")
}

function forceRival(){
const s=getStudents()

localStorage.removeItem("classBoss")
localStorage.removeItem("classMission")

const r=generateRival(s)

if(r){
alert("라이벌 생성 완료")
}else{
alert("라이벌 생성 실패")
}
}

function forceMission(){
const s=getStudents()
const a=getActions()

localStorage.removeItem("classBoss")
localStorage.removeItem("classRival")

const m=generateTeamMission(s,a)

if(m){
localStorage.setItem("classMission",JSON.stringify(m))
alert("팀미션 생성 완료")
}else{
alert("팀미션 생성 실패")
}
}

function back(){
navigate("/")
}

return(

<div style={{padding:40}}>

<h1>대시보드</h1>

<br/>

<ExcelUpload onLoaded={onExcelLoaded}/>

<br/>

{headers.length>0 && (

<div>

<h2>버튼 선택</h2>

{headers.map((h,i)=>(

<div key={i}>
<label>
<input
type="checkbox"
checked={selected.includes(h)}
onChange={()=>toggleAction(h)}
/>
{h}
</label>
</div>

))}

<br/>

<button onClick={saveActions}>
저장
</button>

</div>

)}

<br/>

<PasswordSettings/>

<br/>

<button onClick={exportScoreExcel}>점수 다운로드</button>
<button onClick={exportLogExcel}>로그 다운로드</button>

<br/><br/>

<h2>이벤트 관리</h2>

<button onClick={forceBoss}>보스 생성</button>
<button onClick={forceRival}>라이벌 생성</button>
<button onClick={forceMission}>팀미션 생성</button>
<button onClick={clearAllEvents}>이벤트 취소</button>

<br/><br/>

<button onClick={back}>뒤로가기</button>

</div>

)

}