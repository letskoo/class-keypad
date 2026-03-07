export default function BossPanel({boss}){

if(!boss) return null

const percent = (boss.hp / boss.maxHp) * 100

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
style={{width:`${percent}%`}}
/>

</div>

<div className="bossInfo">
HP {boss.hp} / {boss.maxHp}
</div>

<div className="bossMission">
{boss.action} 버튼으로 공격
</div>

</div>

</div>

)

}