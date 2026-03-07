import {useEffect,useState} from "react"
import {useNavigate} from "react-router-dom"

import ExcelUpload from "../components/ExcelUpload"
import PasswordSettings from "../components/PasswordSettings"

import {getActions,getStudents} from "../engine/classData"

import {
getTodayParticipants,
getTodayChampion,
getWeekChampion,
getEncourageStudents,
getTodayAbsentees,
getTodayAttendanceOnly,
getConsecutiveAbsentees,
getAbsencePattern,
getParticipationHeatmap,
getParticipationTop,
getParticipationRanking,
getRiskStudents,
getStudentParticipationGraph
} from "../engine/analyticsEngine"

import {exportScoreExcel,exportLogExcel} from "../excel/exportExcel"
import {loadSettings,saveSettings} from "../utils/settings"

export default function Dashboard(){

const navigate = useNavigate()

const[participants,setParticipants]=useState(0)
const[totalStudents,setTotalStudents]=useState(0)

const[todayChampion,setTodayChampion]=useState(null)
const[weekChampion,setWeekChampion]=useState(null)

const[encourageDays,setEncourageDays]=useState(5)
const[encourageList,setEncourageList]=useState([])

const[actions,setActions]=useState([])
const[selected,setSelected]=useState([])

const[absentees,setAbsentees]=useState([])
const[attendanceOnly,setAttendanceOnly]=useState([])
const[consecutiveAbsent,setConsecutiveAbsent]=useState([])

const[heatmap,setHeatmap]=useState({})

const[topParticipants,setTopParticipants]=useState([])
const[ranking,setRanking]=useState([])

const[riskStudents,setRiskStudents]=useState([])

const[graphStudent,setGraphStudent]=useState(null)
const[graphData,setGraphData]=useState([])

function refresh(){

const settings = loadSettings()
const days = Number(settings?.encourageDays || 5)

setEncourageDays(days)

const students = getStudents()
setTotalStudents(students.length)

setParticipants(getTodayParticipants())
setTodayChampion(getTodayChampion())
setWeekChampion(getWeekChampion())

setEncourageList(getEncourageStudents(days))

setAbsentees(getTodayAbsentees())
setAttendanceOnly(getTodayAttendanceOnly())
setConsecutiveAbsent(getConsecutiveAbsentees())

setHeatmap(getParticipationHeatmap())

setTopParticipants(getParticipationTop())
setRanking(getParticipationRanking())

setRiskStudents(getRiskStudents())

const a = getActions()
setActions(a)

if(settings.actions && settings.actions.length>0){
setSelected(settings.actions)
}else{
setSelected(a)
}

}

useEffect(()=>{
refresh()
},[])

function saveEncourageDays(){

const days = Number(encourageDays || 1)

saveSettings({
encourageDays:days
})

setEncourageDays(days)
setEncourageList(getEncourageStudents(days))

alert("사각지역 탐색 기간이 설정되었습니다")

}

function toggleAction(action){

let list=[...selected]

if(list.includes(action)){
list=list.filter(a=>a!==action)
}else{
list.push(action)
}

setSelected(list)

}

function saveActions(){

saveSettings({
actions:selected
})

alert("버튼 설정 완료")

}

function openGraph(student){

setGraphStudent(student)

const data = getStudentParticipationGraph(student)

setGraphData(data)

}

const participationRate =
totalStudents === 0
? 0
: Math.round((participants / totalStudents) * 100)

return(

<div style={{padding:40,maxWidth:960,margin:"0 auto"}}>

<h1>관리자 대시보드</h1>

<div style={{marginTop:20}}>
<button onClick={()=>navigate("/")} style={{padding:"10px 20px"}}>
키패드로 돌아가기
</button>
</div>

<div style={{marginTop:40}}>
<h2>학생 데이터 업로드</h2>
<ExcelUpload onLoaded={refresh}/>
</div>

<div style={{marginTop:40}}>
<h2>버튼 항목 선택</h2>

<div style={{display:"flex",flexWrap:"wrap",gap:10,marginTop:10}}>

{actions.map((a,i)=>(

<label key={i} style={{display:"flex",alignItems:"center",gap:5}}>

<input
type="checkbox"
checked={selected.includes(a)}
onChange={()=>toggleAction(a)}
/>

{a}

</label>

))}

</div>

<button
onClick={saveActions}
style={{marginTop:15,padding:"10px 20px"}}
>
버튼 설정 저장
</button>

</div>

<div style={{marginTop:40,fontSize:20}}>

<h2>오늘 통계</h2>

<div>오늘 참여 : {participants} / {totalStudents}</div>
<div>참여율 : {participationRate}%</div>
<div>오늘 출석만 : {attendanceOnly.length}</div>
<div>오늘 결석 : {absentees.length}</div>
<div>오늘 챔피언 : {todayChampion || "-"}</div>
<div>주간 챔피언 : {weekChampion || "-"}</div>

</div>

<div style={{marginTop:40}}>
<h2>참여 TOP 5</h2>

{topParticipants.map((p,i)=>(

<div key={i} style={{cursor:"pointer"}} onClick={()=>openGraph(p.name)}>
{i+1}. {p.name} ({p.count})
</div>

))}

</div>

<div style={{marginTop:40}}>
<h2>참여 랭킹</h2>

{ranking.map((r,i)=>{

const blocks = Math.min(20,r.count)
const bar = "█".repeat(blocks)

return(

<div key={i} style={{marginBottom:6}}>

{r.name}

<div style={{fontFamily:"monospace"}}>
{bar} {r.count}
</div>

</div>

)

})}

</div>

<div style={{marginTop:40}}>
<h2>최근 30일 참여 히트맵</h2>

<div style={{display:"flex",gap:10,marginTop:10}}>

{Object.keys(heatmap).map(day=>(

<div
key={day}
style={{
flex:1,
background:"white",
padding:15,
borderRadius:10,
boxShadow:"0 2px 8px rgba(0,0,0,0.06)",
textAlign:"center"
}}
>

<div style={{fontSize:18,fontWeight:700}}>
{day}
</div>

<div style={{marginTop:8,fontSize:20}}>
{heatmap[day] || 0}
</div>

</div>

))}

</div>

</div>

<div style={{marginTop:40}}>
<h2>참여 부족 학생</h2>

{encourageList.map((item,i)=>(
<div key={i}>
{item.name} ({item.days}일 참여 없음)
</div>
))}

</div>

<div style={{marginTop:40}}>
<h2>연속 결석</h2>

{consecutiveAbsent.map((s,i)=>{

const pattern = getAbsencePattern(s.name)

let text=""

if(pattern){
text=`${pattern.join(",")} 요일 결석 많음`
}

return(

<div key={i} style={{marginTop:10}}>
{s.name} ({s.days}일)
{text && <div>{text}</div>}
</div>

)

})}

</div>

<div style={{marginTop:40}}>
<h2>위험 학생</h2>

{riskStudents.map((s,i)=>(
<div key={i} style={{color:"red"}}>
{s.name} - {s.type}
</div>
))}

</div>

{graphStudent && (

<div style={{marginTop:40}}>

<h2>{graphStudent} 참여 그래프 (최근 30일)</h2>

<div style={{fontFamily:"monospace",marginTop:10}}>

{graphData.map((d,i)=>{

const bar="█".repeat(d.count)

return(

<div key={i}>
{d.date} {bar}
</div>

)

})}

</div>

</div>

)}

<div style={{marginTop:40}}>
<h2>데이터 다운로드</h2>

<button onClick={exportScoreExcel} style={{padding:"10px 20px",marginRight:10}}>
점수 엑셀 다운로드
</button>

<button onClick={exportLogExcel} style={{padding:"10px 20px"}}>
로그 엑셀 다운로드
</button>

</div>

<PasswordSettings/>

</div>

)

}