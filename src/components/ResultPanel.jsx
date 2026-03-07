import {getStreak} from "../engine/analyticsEngine"
import BossPanel from "./BossPanel"

export default function ResultPanel({top5,result,onConfirm,boss}){

/* 보스 */

if(boss){

return(
<BossPanel boss={boss}/>
)

}

/* 학생 결과 */

if(result){

const streak = getStreak(result.student.name)

let streakText=null

if(streak>=10){
streakText="🔥🔥🔥 10일 연속 참여!"
}
else if(streak>=5){
streakText="🔥🔥 5일 연속 참여!"
}
else if(streak>=3){
streakText="🔥 3일 연속 참여!"
}

return(

<div style={{
height:"100%",
display:"flex",
flexDirection:"column",
justifyContent:"center",
alignItems:"center"
}}>

<div style={{fontSize:"120px"}}>
{result.student.character}
</div>

<div style={{fontSize:"48px",fontWeight:"800"}}>
{result.student.name}
</div>

{streakText && (
<div style={{fontSize:"24px",color:"#ff6b00"}}>
{streakText}
</div>
)}

<div style={{marginTop:"20px",fontSize:"26px"}}>
{result.action} +1
</div>

{result.bonus>0 && (
<div style={{fontSize:"26px",color:"#ff6b00"}}>
{result.bonusType} +{result.bonus}
</div>
)}

<div style={{fontSize:"22px"}}>
현재 점수 {result.score}
</div>

<div style={{fontSize:"22px"}}>
Lv {result.level}
</div>

<div style={{fontSize:"20px",marginTop:"10px"}}>
{result.message}
</div>

<button
onClick={onConfirm}
style={{
marginTop:"20px",
padding:"16px 40px",
fontSize:"20px",
borderRadius:"10px",
border:"none",
background:"#4a7cff",
color:"white"
}}
>
확인
</button>

</div>

)

}

/* TOP5 */

return(

<div style={{
height:"100%",
display:"flex",
flexDirection:"column",
justifyContent:"center"
}}>

<h2 style={{marginBottom:"20px"}}>TOP 5</h2>

{top5.map((s,i)=>(

<div
key={i}
style={{
display:"flex",
justifyContent:"space-between",
padding:"10px 0",
fontSize:"20px",
fontWeight:i===0?"700":"400",
color:i===0?"#ff8c00":"#333"
}}
>

<span>{i+1}</span>
<span>{s.character}</span>
<span>{s.name}</span>
<span>{s.scoreTotal}</span>

</div>

))}

</div>

)

}