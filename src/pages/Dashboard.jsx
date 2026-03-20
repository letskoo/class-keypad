import {useEffect,useState} from "react"
import {useNavigate} from "react-router-dom"

import {
getTodaySummary,
getTodayPresentStudents,
getConsecutiveAbsent,
getAbsentPatterns
} from "../engine/analyticsEngine"

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

/* 관심학생 */
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

/* 🔥 안전 처리 함수 */
function safeJoin(arr){
if(!arr || arr.length===0) return "없음"
return arr.join(", ")
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

<div className="dashboardContent" style={{display:"block",overflow:"auto"}}>

{/* 오늘 요약 */}
<div className="reportSection">
<h2>오늘 요약</h2>
<div>전체 [ {summary.total || "N"} ] 명</div>
<div>
참여 [ {summary.present || "N"} ] 명 |
미참여 [ {summary.nonParticipants || "N"} ] 명 |
결석 [ {summary.absent===null?"N":summary.absent} ] 명
</div>
</div>

<hr/>

{/* 출결 분석 */}
<div className="reportSection">
<h2>출결 분석</h2>

<div>
오늘 결석한 학생은 {
summary.absentList===null
? "데이터 부족"
: safeJoin(summary.absentList)
} 입니다
</div>

<br/>

{consecutive===null && <div>데이터 부족</div>}

{consecutive && (
<>
<div>3일째 결석한 학생은 {safeJoin(consecutive[3])}</div>
<div>5일째 결석한 학생은 {safeJoin(consecutive[5])}</div>
<div>7일 이상 결석한 학생은 {safeJoin(consecutive[7])}</div>
</>
)}

</div>

<hr/>

{/* 요일별 */}
<div className="reportSection">
<h2>요일별 결석 현황</h2>

{patterns===null && "데이터 부족"}

{patterns && (
<div className="weekChart">
{patterns.map((v,i)=>(
<div key={i} className="weekItem">
<div className="weekBar" style={{height:v*10}}></div>
<div>{DAYS[i]}</div>
</div>
))}
</div>
)}

</div>

<hr/>

{/* 관심 학생 */}
<div className="reportSection">
<h2>사각지대 학생 탐구</h2>

<div>
3일간 버튼을 누르지 않은 학생은 {inactive.length ? inactive.map(s=>s.name).join(", ") : "없음"} 입니다
</div>

<br/>

<button className="actionBtn">
이 학생을 상위 10% 학생과 팀 지어 주기
</button>

<button className="actionBtn">
이 학생이 버튼 누르면 보너스 점수 주기
</button>

</div>

</div>

</div>

)

}