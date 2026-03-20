import {useEffect,useState} from "react"
import {useNavigate} from "react-router-dom"

import ExcelUpload from "../components/ExcelUpload"
import PasswordSettings from "../components/PasswordSettings"

import {
getTodayParticipants,
getTodayChampion,
getWeekChampion
} from "../engine/analyticsEngine"

import {exportScoreExcel,exportLogExcel} from "../excel/exportExcel"

import {loadSettings,saveSettings} from "../utils/settings"

import {getStudents,getActions,resetAllStudents} from "../engine/classData"
import {generateRival} from "../engine/rivalEngine"
import {generateTeamMission} from "../engine/teamMissionEngine"

import "../styles/dashboard.css"

export default function Dashboard(){

const navigate=useNavigate()
const[tab,setTab]=useState("analysis")

const[participants,setParticipants]=useState(0)
const[todayChampion,setTodayChampion]=useState(null)
const[weekChampion,setWeekChampion]=useState(null)

const[headers,setHeaders]=useState([])
const[selected,setSelected]=useState([])

useEffect(()=>{

setParticipants(getTodayParticipants())
setTodayChampion(getTodayChampion())
setWeekChampion(getWeekChampion())

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

function resetAll(){
const ok = window.confirm("초기화 됩니다. 정말 초기화 하시겠습니까?")
if(!ok) return
resetAllStudents()
alert("초기화 완료")
window.location.reload()
}

function exitApp(){
window.close()
}

return(

<div className="dashboardLayout">

{/* 왼쪽 */}
<div className="dashboardSidebar">

<div className={`dashboardTab ${tab==="analysis"?"active":""}`} onClick={()=>setTab("analysis")}>
학생 분석
</div>

<div className={`dashboardTab ${tab==="action"?"active":""}`} onClick={()=>setTab("action")}>
키패드 설정
</div>

<div className={`dashboardTab ${tab==="event"?"active":""}`} onClick={()=>setTab("event")}>
미션
</div>

<div className={`dashboardTab ${tab==="system"?"active":""}`} onClick={()=>setTab("system")}>
관리자
</div>

<div className="dashboardBottom">

<button
className="dashboardBtn back"
onClick={()=>navigate("/")}>
뒤로가기
</button>

<button
className="dashboardBtn exit"
onClick={exitApp}>
프로그램 종료
</button>

</div>

</div>

{/* 오른쪽 */}
<div className="dashboardContent">

{tab==="analysis" && (
<div>
<h2>학생 분석</h2>
<div>오늘 참여: {participants}</div>
<div>오늘 1등: {todayChampion}</div>
<div>주간 1등: {weekChampion}</div>

<br/>

<button onClick={exportScoreExcel}>점수 다운로드</button>
<button onClick={exportLogExcel}>로그 다운로드</button>
</div>
)}

{tab==="action" && (
<div>

<ExcelUpload onLoaded={onExcelLoaded}/>

{headers.length>0 && (
<div>
<h2>버튼 설정</h2>

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

<button onClick={saveActions}>저장</button>

</div>
)}

</div>
)}

{tab==="event" && (
<div>
<button onClick={forceBoss}>보스 생성</button>
<button onClick={forceRival}>라이벌 생성</button>
<button onClick={forceMission}>팀미션 생성</button>
<button onClick={clearAllEvents}>이벤트 취소</button>
</div>
)}

{tab==="system" && (
<div>
<PasswordSettings/>
<button onClick={resetAll} style={{background:"#ef4444",color:"#fff"}}>
전체 초기화
</button>
</div>
)}

</div>

</div>

)

}