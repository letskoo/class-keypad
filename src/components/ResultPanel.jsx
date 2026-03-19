import {getStreak} from "../engine/analyticsEngine"
import BossPanel from "./BossPanel"
import TeamMissionPanel from "./TeamMissionPanel"
import {checkRival} from "../engine/rivalEngine"

export default function ResultPanel({top5=[],result,onConfirm,boss,mission,rival}){

/* 🔥 result 안전 처리 */
if(result && result.student){

const streak = getStreak(result.student?.name || "")

let streakText=null

if(streak>=10) streakText="10연속 참여!"
else if(streak>=5) streakText="5연속 참여!"
else if(streak>=3) streakText="3연속 참여!"

return(

<div style={{
height:"100%",
display:"flex",
flexDirection:"column",
justifyContent:"center",
alignItems:"center"
}}>

<div style={{fontSize:"120px"}}>
{result.student?.character}
</div>

<div style={{fontSize:"48px",fontWeight:"800"}}>
{result.student?.name}
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
<div>
{result.bonusType} +{result.bonus}
</div>
)}

<div>
점수 {result.score}
</div>

<div>
Lv {result.level}
</div>

<button
onClick={()=>onConfirm && onConfirm()}
style={{
marginTop:"20px",
padding:"16px 40px"
}}
>
확인
</button>

</div>

)

}

/* 🔥 보스 */
if(boss){
return(<BossPanel boss={boss}/>)
}

/* 🔥 미션 */
if(mission){
return(
<div style={{height:"100%",display:"flex",justifyContent:"center"}}>
<TeamMissionPanel mission={mission}/>
</div>
)
}

/* 🔥 라이벌 */
if(rival){

const rivalResult = checkRival(rival.student)
let need = rivalResult?.need || 0

return(
<div style={{height:"100%",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
<h2>라이벌 미션</h2>
<div>목표 : {rival.student?.name}</div>
<div>필요 : {need}</div>
</div>
)
}

/* 🔥 기본 */
return(

<div style={{
height:"100%",
display:"flex",
flexDirection:"column",
justifyContent:"center"
}}>

<h2>TOP 5</h2>

{top5.map((s,i)=>(

<div key={i} style={{display:"flex",justifyContent:"space-between"}}>
<span>{i+1}</span>
<span>{s.character}</span>
<span>{s.name}</span>
<span>{s.scoreTotal}</span>
</div>

))}

</div>

)

}