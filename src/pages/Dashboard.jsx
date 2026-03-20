import {useEffect,useState} from "react"
import {useNavigate} from "react-router-dom"

import {
getTodaySummary,
getTodayPresentStudents,
getConsecutiveAbsent,
getAbsentPatterns
} from "../engine/analyticsEngine"

import { generateTeamMission } from "../engine/teamMissionEngine"

import "../styles/dashboard.css"

export default function Dashboard(){

const navigate=useNavigate()

const[summary,setSummary]=useState({})
const[presentList,setPresentList]=useState([])
const[consecutive,setConsecutive]=useState(null)
const[patterns,setPatterns]=useState(null)

useEffect(()=>{
setSummary(getTodaySummary())
setPresentList(getTodayPresentStudents())
setConsecutive(getConsecutiveAbsent())
setPatterns(getAbsentPatterns())
},[])

function exitApp(){
window.close()
}

const DAYS=["일","월","화","수","목","금","토"]

function getInactive(){

const logs = JSON.parse(localStorage.getItem("classLogs") || "[]")
const students = JSON.parse(localStorage.getItem("classStudents") || "[]")

const todayDate = new Date()

return students.map(s=>{

const userLogs = logs.filter(l=>l.student===s.name && l.action!=="AUTO_ATTENDANCE")

if(userLogs.length===0){
return {name:s.name,days:999}
}

const last = userLogs[userLogs.length-1].date
const diff = Math.floor((todayDate - new Date(last))/(1000*60*60*24))

return {name:s.name,days:diff}

}).filter(s=>s.days>=3)

}

const inactive = getInactive()

function safeJoin(arr){
if(!Array.isArray(arr) || arr.length===0) return "없음"
return arr.join(", ")
}

/* ===== 팀미션 ===== */
function startTeamMission(){

const students = JSON.parse(localStorage.getItem("classStudents") || "[]")
const actions = JSON.parse(localStorage.getItem("classData") || "{}")?.actions || []

generateTeamMission(students,actions)

alert("팀미션 시작됨")

}

/* ===== 오늘 보너스 ===== */
function startTodayBonus(){

const now = new Date()

const date =
now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,"0")+"-"+String(now.getDate()).padStart(2,"0")

localStorage.setItem("todayBonusEvent",JSON.stringify({
date,
bonus:5,
used:{}   // 🔥 학생별 1회 제한
}))

alert("오늘 보너스 이벤트 시작")

}

return(

<div className="dashboardLayout">

<div className="dashboardSidebar">
<div className="dashboardTab active">학생 분석</div>

<div className="dashboardBottom">
<button className="dashboardBtn back" onClick={()=>navigate("/")}>뒤로가기</button>
<button className="dashboardBtn exit" onClick={exitApp}>종료</button>
</div>
</div>

<div className="dashboardContent">

{/* ===== 카드 ===== */}
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"20px",marginBottom:"30px"}}>

<div style={card}>
<div style={cardTitle}>전체</div>
<div style={cardValue}>{summary.total || 0}</div>
</div>

<div style={card}>
<div style={cardTitle}>참여</div>
<div style={cardValue}>{summary.present || 0}</div>
</div>

<div style={card}>
<div style={cardTitle}>미참여</div>
<div style={cardValue}>{summary.nonParticipants || 0}</div>
</div>

<div style={card}>
<div style={cardTitle}>결석</div>
<div style={cardValue}>{summary.absent===null?0:summary.absent}</div>
</div>

</div>

{/* ===== 결석 ===== */}
<div style={box}>

<h3 style={boxTitle}>결석 분석</h3>

<div style={row}>
오늘 결석 : {summary.absentList===null ? "데이터 없음" : safeJoin(summary.absentList)}
</div>

<div style={row}>3일 연속 : {safeJoin(consecutive?.[3])}</div>
<div style={row}>5일 연속 : {safeJoin(consecutive?.[5])}</div>
<div style={row}>7일 이상 : {safeJoin(consecutive?.[7])}</div>

</div>

{/* ===== 패턴 ===== */}
<div style={box}>

<h3 style={boxTitle}>요일별 결석</h3>

{patterns && (
<div style={{display:"flex",alignItems:"flex-end",gap:"20px",height:"120px"}}>

{patterns.map((v,i)=>(
<div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
<div style={{width:"20px",height:v*10,background:"#1e293b",borderRadius:"4px"}}></div>
<div style={{marginTop:"6px"}}>{DAYS[i]}</div>
</div>
))}

</div>
)}

</div>

{/* ===== 위험 ===== */}
<div style={box}>

<h3 style={boxTitle}>위험 학생</h3>

<div style={row}>
3일 이상 미참여 : {inactive.length ? inactive.map(s=>s.name).join(", ") : "없음"}
</div>

<div style={{display:"flex",gap:"10px",marginTop:"15px"}}>

<button className="actionBtn" onClick={startTeamMission}>
상위 10%와 팀미션 하기
</button>

<button className="actionBtn" onClick={startTodayBonus}>
오늘 버튼 누르면 보너스 주기
</button>

</div>

</div>

</div>

</div>

)

}

/* ===== 스타일 ===== */

const card={
background:"#fff",
padding:"20px",
borderRadius:"14px",
boxShadow:"0 4px 12px rgba(0,0,0,0.05)",
textAlign:"center"
}

const cardTitle={
fontSize:"14px",
color:"#64748b",
marginBottom:"6px"
}

const cardValue={
fontSize:"28px",
fontWeight:"700",
color:"#1e293b"
}

const box={
background:"#fff",
padding:"20px",
borderRadius:"14px",
marginBottom:"20px",
boxShadow:"0 4px 12px rgba(0,0,0,0.05)"
}

const boxTitle={
fontSize:"16px",
fontWeight:"700",
marginBottom:"10px"
}

const row={
fontSize:"14px",
marginBottom:"6px",
color:"#374151"
}