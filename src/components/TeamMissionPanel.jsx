export default function TeamMissionPanel({mission}){

if(!mission) return null

return(

<div style={{
marginTop:"20px",
padding:"20px",
background:"#fff3cd",
borderRadius:"10px"
}}>

<h2>오늘의 팀 미션</h2>

{mission.team.map((s,i)=>(

<div key={i}>
{s.name}
</div>

))}

</div>

)

}