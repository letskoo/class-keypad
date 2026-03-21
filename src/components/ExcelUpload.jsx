import {readExcel} from "../excel/excelReader"
import {setClassData} from "../engine/classData"
import {saveSettings,loadSettings} from "../utils/settings"
import {useState,useEffect} from "react"

export default function ExcelUpload({onLoaded}){

const[headers,setHeaders]=useState([])
const[selected,setSelected]=useState({})

/* 🔥 기존 항목 유지 (핵심 수정) */
useEffect(()=>{

const savedHeaders = JSON.parse(localStorage.getItem("classHeaders") || "[]")
const savedActions = loadSettings()?.actions || []

if(savedHeaders.length){

setHeaders(savedHeaders)

const map={}
savedHeaders.forEach(a=>{
map[a]=savedActions.includes(a)
})

setSelected(map)

}

},[])

async function upload(e){

try{

const file = e.target.files?.[0]
if(!file) return

const data = await readExcel(file)

if(!data || !data.students || !data.headers){
alert("엑셀 형식 오류")
return
}

setClassData(data)

const actions=data.headers.slice(1)

/* 🔥 headers 저장 (핵심) */
localStorage.setItem("classHeaders",JSON.stringify(actions))

const map={}
actions.forEach(a=>map[a]=false)

setHeaders(actions)
setSelected(map)

saveSettings({
actions:[]
})

if(onLoaded){
onLoaded(data)
}

alert("학생 데이터 업로드 완료")

}catch(e){

console.log("excel upload fail",e)
alert("엑셀 업로드 실패")

}

}

/* 체크 변경 */
function toggleAction(a){

const newState={...selected}

const count = Object.values(newState).filter(v=>v).length

if(!newState[a] && count>=5){
alert("최대 5개까지 선택 가능")
return
}

newState[a]=!newState[a]

setSelected(newState)

const filtered = Object.keys(newState).filter(k=>newState[k])

saveSettings({
actions:filtered
})

}

return(

<div>

<label
className="actionBtn"
style={{
display:"flex",
alignItems:"center",
justifyContent:"center",
cursor:"pointer"
}}
>
엑셀 파일 선택
<input
type="file"
accept=".xlsx"
onChange={upload}
style={{display:"none"}}
/>
</label>

{headers.length>0 && (

<div style={{
marginTop:"20px",
display:"grid",
gridTemplateColumns:"repeat(7,1fr)",
gap:"10px"
}}>

{headers.map((h,i)=>(

<div
key={i}
onClick={()=>toggleAction(h)}
style={{
aspectRatio:"1/1",
display:"flex",
alignItems:"center",
justifyContent:"center",
borderRadius:"10px",
background:selected[h] ? "#4338ca" : "#e5e7eb",
color:selected[h] ? "#fff" : "#111",
fontWeight:"600",
cursor:"pointer",
textAlign:"center",
padding:"8px"
}}
>
{h}
</div>

))}

</div>

)}

</div>

)

}