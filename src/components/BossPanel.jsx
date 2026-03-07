export default function BossPanel({boss}){

if(!boss) return null

if(boss.type==="student"){

return(

<div className="resultPanel">

<h2>👑 오늘의 보스</h2>

<div className="bossBox">

<div className="bossName">
😈 {boss.name}
</div>

<div className="bossInfo">
랭킹 : {boss.rank}위
</div>

<div className="bossInfo">
점수 : {boss.score}
</div>

<div className="bossInfo">
오늘 버튼 : {boss.todayCount}
</div>

<div className="bossMission">
⚔ 이 학생보다 점수 높이기
</div>

</div>

</div>

)

}

if(boss.type==="monster"){

return(

<div className="resultPanel">

<h2>👾 {boss.action} 몬스터</h2>

<div className="bossBox">

<div className="monsterFace">
👾
</div>

<div className="hpBar">

<div
className="hpFill"
style={{width:`${boss.hp}%`}}
/>

</div>

<div className="bossInfo">
HP {boss.hp} / 100
</div>

<div className="bossMission">
⚔ {boss.action} 버튼으로 공격
</div>

</div>

</div>

)

}

return null

}