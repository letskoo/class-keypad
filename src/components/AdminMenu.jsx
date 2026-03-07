import {installPWA} from "../utils/pwaInstall"

export default function AdminMenu({onDashboard,onExit,onClose}){

async function installApp(){

try{

const ok = await installPWA()

if(ok){
alert("앱 설치 완료")
}else{
alert("설치 불가 또는 취소")
}

}catch(e){
alert("이 브라우저에서는 설치가 지원되지 않습니다")
}

}

return(

<div style={overlay}>

<div style={box}>

<h2>관리자 메뉴</h2>

<button style={btn} onClick={installApp}>
앱 설치
</button>

<button style={btn} onClick={onDashboard}>
대시보드
</button>

<button style={btn} onClick={onExit}>
앱 종료
</button>

<button style={btn} onClick={onClose}>
닫기
</button>

</div>

</div>

)

}

const overlay={
position:"fixed",
top:0,
left:0,
right:0,
bottom:0,
background:"rgba(0,0,0,0.4)",
display:"flex",
justifyContent:"center",
alignItems:"center",
zIndex:999
}

const box={
background:"#fff",
padding:30,
borderRadius:10,
width:300,
textAlign:"center",
display:"flex",
flexDirection:"column",
gap:15
}

const btn={
padding:"14px",
fontSize:18
}