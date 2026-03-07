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

useEffect(()=>{

setParticipants(getTodayParticipants())
setTodayChampion(getTodayChampion())
setWeekChampion(getWeekChampion())

setEncourage(getEncourageStudents(5))
setAbsent(getConsecutiveAbsentees())
setRisk(getRiskStudents())
setTop(getParticipationTop())

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

saveSettings({
actions:selected
})

alert("항목 저장 완료")

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

<h2>버튼 항목 선택</h2>

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
항목 저장
</button>

</div>

)}

<br/>

<PasswordSettings/>

<br/>

<button onClick={exportScoreExcel}>
점수 엑셀 다운로드
</button>

<button onClick={exportLogExcel}>
로그 엑셀 다운로드
</button>

<br/><br/>

<h2>오늘 참여 학생</h2>
{participants}

<h2>오늘 챔피언</h2>
{todayChampion}

<h2>주간 챔피언</h2>
{weekChampion}

<br/>

<h2>참여 TOP5</h2>

{top.map((s,i)=>(

<div key={i}>
{s.name} : {s.count}
</div>

))}

<br/>

<h2>참여 부족 학생</h2>

{encourage.map((s,i)=>(

<div key={i}>
{s.name} ({s.days}일)
</div>

))}

<br/>

<h2>연속 결석</h2>

{absent.map((s,i)=>(

<div key={i}>
{s.name} ({s.days}일)
</div>

))}

<br/>

<h2>위험 학생</h2>

{risk.map((s,i)=>(

<div key={i}>
{s.name} - {s.type}
</div>

))}

<br/>

<button onClick={back}>
키패드로 돌아가기
</button>

</div>

)

}