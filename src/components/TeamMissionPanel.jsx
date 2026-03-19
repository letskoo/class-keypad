export default function TeamMissionPanel({mission}){

if(!mission) return null

let ruleText=""

if(mission.rule){

if(mission.rule.type==="any1"){
ruleText="아무 버튼 1회"
}

else if(mission.rule.type==="any2"){
ruleText="아무 버튼 2회"
}

else if(mission.rule.type==="specific1"){
ruleText=`${mission.rule.action} 버튼 1회`
}

else if(mission.rule.type==="specific2"){
ruleText=`${mission.rule.action} 버튼 1회`
}

}

return(

<div style={{
marginTop:"20px",
padding:"20px",
background:"#fff3cd",
borderRadius:"10px"
}}>

<h2>오늘의 팀 미션</h2>

<div style={{marginBottom:"10px",fontWeight:"600"}}>
미션 : {ruleText}
</div>

<div style={{marginTop:"10px"}}>

{mission.team.map((s,i)=>{

const progress = mission.progress?.[s.name] || 0
const target = mission.rule?.count || 1

return(

<div
key={i}
style={{
display:"flex",
justifyContent:"space-between",
padding:"6px 0",
fontSize:"18px"
}}
>

<span>{s.name}</span>

<span>
{progress} / {target}
</span>

</div>

)

})}

</div>

</div>

)

}