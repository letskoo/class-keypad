// 🔥 변경: 탭 하나 추가 + ExcelUpload 이동

import {useEffect,useState} from "react"
import {useNavigate} from "react-router-dom"

import {
getTodaySummary,
getTodayPresentStudents,
getConsecutiveAbsent,
getAbsentPatterns
} from "../engine/analyticsEngine"

import { generateTeamMission } from "../engine/teamMissionEngine"

import ExcelUpload from "../components/ExcelUpload"
import PasswordSettings from "../components/PasswordSettings"

import { exportScoreExcel, exportLogExcel } from "../excel/exportExcel"
import { resetAllStudents, getStudents } from "../engine/classData"

import "../styles/dashboard.css"

export default function Dashboard(){

const navigate=useNavigate()

const[tab,setTab]=useState("analysis")

const[summary,setSummary]=useState({})
const[presentList,setPresentList]=useState([])
const[consecutive,setConsecutive]=useState(null)
const[patterns,setPatterns]=useState(null)

const[students,setStudents]=useState([])

useEffect(()=>{
setSummary(getTodaySummary())
setPresentList(getTodayPresentStudents())
setConsecutive(getConsecutiveAbsent())
setPatterns(getAbsentPatterns())

setStudents([...getStudents()])
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

/* 팀미션 */
function startTeamMission(){
const students = JSON.parse(localStorage.getItem("classStudents") || "[]")
const actions = JSON.parse(localStorage.getItem("classData") || "{}")?.actions || []
generateTeamMission(students,actions)
alert("팀미션 시작됨")
}

/* 보너스 */
function startTodayBonus(){

const now = new Date()

const date =
now.getFullYear()+"-"+String(now.getMonth()+1).padStart(2,"0")+"-"+String(now.getDate()).padStart(2,"0")

localStorage.setItem("todayBonusEvent",JSON.stringify({
date,
bonus:5,
used:{}
}))

alert("오늘 보너스 이벤트 시작")

}

/* 초기화 */
function resetAll(){

if(!window.confirm("정말 초기화 하겠습니까?")) return

resetAllStudents()
alert("초기화 완료")
window.location.reload()

}

/* 학생 삭제 */
function deleteStudent(name){

if(!window.confirm(`${name} 삭제?`)) return

const list = students.filter(s=>s.name!==name)

localStorage.setItem("classStudents",JSON.stringify(list))
setStudents(list)

}

/* 학생 추가 */
function addStudent(){

const name = prompt("이름")
if(!name) return

const list = [...students,{
name,
num:students.length+1,
scores:{},
scoreTotal:0,
level:1
}]

localStorage.setItem("classStudents",JSON.stringify(list))
setStudents(list)

}

/* 학생 수정 */
function editStudent(s){

const name = prompt("이름 수정",s.name)
if(!name) return

const num = prompt("번호 수정",s.num)
if(!num) return

const list = students.map(st=>{
if(st.name===s.name){
return {...st,name,num:Number(num)}
}
return st
})

localStorage.setItem("classStudents",JSON.stringify(list))
setStudents(list)

}

return(

<div className="dashboardLayout">

<div className="dashboardSidebar">

<div className={`dashboardTab ${tab==="analysis"?"active":""}`} onClick={()=>setTab("analysis")}>
학생 분석
</div>

<div className={`dashboardTab ${tab==="manage"?"active":""}`} onClick={()=>setTab("manage")}>
학생 관리
</div>

{/* 🔥 추가 */}
<div className={`dashboardTab ${tab==="keypad"?"active":""}`} onClick={()=>setTab("keypad")}>
키패드 설정
</div>

<div className="dashboardBottom">
<button className="dashboardBtn back" onClick={()=>navigate("/")}>뒤로가기</button>
<button className="dashboardBtn exit" onClick={exitApp}>종료</button>
</div>

</div>

<div className="dashboardContent">

{/* ================= 분석 ================= */}
{tab==="analysis" && (

<>

<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"20px",marginBottom:"30px"}}>

<div style={card}><div style={cardTitle}>전체</div><div style={cardValue}>{summary.total || 0}</div></div>
<div style={card}><div style={cardTitle}>참여</div><div style={cardValue}>{summary.present || 0}</div></div>
<div style={card}><div style={cardTitle}>미참여</div><div style={cardValue}>{summary.nonParticipants || 0}</div></div>
<div style={card}><div style={cardTitle}>결석</div><div style={cardValue}>{summary.absent===null?0:summary.absent}</div></div>

</div>

<div style={box}>
<h3 style={boxTitle}>결석 분석</h3>
<div style={row}>오늘 결석 : {summary.absentList===null ? "데이터 없음" : safeJoin(summary.absentList)}</div>
<div style={row}>3일 : {safeJoin(consecutive?.[3])}</div>
<div style={row}>5일 : {safeJoin(consecutive?.[5])}</div>
<div style={row}>7일 : {safeJoin(consecutive?.[7])}</div>
</div>

<div style={box}>
<h3 style={boxTitle}>요일 패턴</h3>
{patterns && (
<div style={{display:"flex",alignItems:"flex-end",gap:"20px",height:"120px"}}>
{patterns.map((v,i)=>(
<div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
<div style={{width:"20px",height:v*10,background:"#1e293b"}}></div>
<div>{DAYS[i]}</div>
</div>
))}
</div>
)}
</div>

<div style={box}>
<h3 style={boxTitle}>위험 학생</h3>
<div style={row}>3일 이상 : {inactive.length ? inactive.map(s=>s.name).join(", ") : "없음"}</div>

<div style={{display:"flex",gap:"10px",marginTop:"15px"}}>
<button className="actionBtn" onClick={startTeamMission}>상위 10%와 팀미션 하기</button>
<button className="actionBtn" onClick={startTodayBonus}>오늘 버튼 누르면 보너스 주기</button>
</div>

</div>

</>

)}

{/* ================= 관리 ================= */}
{tab==="manage" && (

<>

<div style={{display:"flex",gap:"10px",flexWrap:"wrap"}}>

<button className="actionBtn" onClick={exportScoreExcel}>
월별 점수 다운로드
</button>

<button className="actionBtn" onClick={exportLogExcel}>
누적 로그 다운로드
</button>

<button
className="actionBtn"
style={{background:"#ef4444"}}
onClick={resetAll}
>
전체 초기화
</button>

</div>

<br/><br/>

<button className="actionBtn" onClick={addStudent}>
학생 추가
</button>

<div style={{marginTop:"20px",display:"grid",gap:"10px"}}>

{students.map((s,i)=>(

<div key={i} style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
padding:"14px",
background:"#fff",
borderRadius:"12px",
boxShadow:"0 2px 8px rgba(0,0,0,0.05)"
}}>

<div style={{fontWeight:"600"}}>
{s.num}. {s.name}
</div>

<div style={{display:"flex",gap:"8px"}}>

<button style={miniBtn} onClick={()=>editStudent(s)}>수정</button>
<button style={miniBtnDanger} onClick={()=>deleteStudent(s.name)}>삭제</button>

</div>

</div>

))}

</div>

<PasswordSettings/>

</>

)}

{/* ================= 키패드 설정 ================= */}
{tab==="keypad" && (

<>

<ExcelUpload onLoaded={()=>setTab("keypad")}/>

</>

)}

</div>

</div>

)

}

/* 스타일 */

const card={background:"#fff",padding:"20px",borderRadius:"14px",boxShadow:"0 4px 12px rgba(0,0,0,0.05)",textAlign:"center"}
const cardTitle={fontSize:"14px",color:"#64748b"}
const cardValue={fontSize:"28px",fontWeight:"700"}
const box={background:"#fff",padding:"20px",borderRadius:"14px",marginBottom:"20px",boxShadow:"0 4px 12px rgba(0,0,0,0.05)"}
const boxTitle={fontSize:"16px",fontWeight:"700",marginBottom:"10px"}
const row={fontSize:"14px",marginBottom:"6px"}

const miniBtn={
padding:"6px 12px",
borderRadius:"6px",
border:"none",
background:"#e2e8f0",
cursor:"pointer"
}

const miniBtnDanger={
...miniBtn,
background:"#fecaca"
}