import {readExcel} from "../excel/excelReader"
import {setClassData} from "../engine/classData"
import {saveSettings} from "../utils/settings"
import {useState} from "react"

export default function ExcelUpload({onLoaded}){

const[headers,setHeaders]=useState([])
const[selected,setSelected]=useState({})

async function upload(e){

try{

const file = e.target.files?.[0]

if(!file) return

const data = await readExcel(file)

if(!data || !data.students || !data.headers){

alert("?묒? ?뺤떇 ?ㅻ쪟")
return

}

setClassData(data)

const actions=data.headers.slice(1)

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

alert("?숈깮 ?곗씠???낅줈???꾨즺")

}catch(e){

console.log("excel upload fail",e)

alert("?묒? ?낅줈???ㅽ뙣")

}

}

/* 체크 변경 */
function toggleAction(a){

const newState={...selected}

const count = Object.values(newState).filter(v=>v).length

if(!newState[a] && count>=5){
alert("理쒕? 5媛쒓퉴吏 ?좏깮 媛??")
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

{/* 버튼 중앙 정렬 */}
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

{/* 카드형 체크 UI */}
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