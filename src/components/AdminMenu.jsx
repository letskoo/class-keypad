import {installPWA} from "../utils/pwaInstall"

export default function AdminMenu({onDashboard,onExit,onClose}){

async function installApp(){

try{

const ok = await installPWA()

if(ok){
alert("설치 완료")
}else{
alert("설치 불가 또는 취소")
}

}catch(e){
alert("브라우저에서 설치가 지원되지 않습니다")
}

}

function moveDashboard(){
if(onClose) onClose()
if(onDashboard) onDashboard()
}

function exitApplication(){
if(onClose) onClose()
if(onExit) onExit()
}

function closeMenu(){
if(onClose) onClose()
}

return(

<div style={overlay}>

<div style={box}>

<h2 style={{marginBottom:10}}>관리자 메뉴</h2>

<button type="button" style={btn} onClick={installApp}>
앱설치
</button>

<button type="button" style={btn} onClick={moveDashboard}>
대시보드
</button>

<button type="button" style={btn} onClick={exitApplication}>
종료
</button>

<button type="button" style={btn} onClick={closeMenu}>
돌아가기
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
background:"rgba(0,0,0,0.5)",
display:"flex",
justifyContent:"center",
alignItems:"center",
zIndex:999
}

const box={
background:"#f8fafc",
padding:30,
borderRadius:16,
width:320,
textAlign:"center",
display:"flex",
flexDirection:"column",
gap:14,
boxShadow:"0 10px 30px rgba(0,0,0,0.2)"
}

const btn={
height:50,
borderRadius:12,
border:"none",
background:"#334155",
color:"#fff",
fontSize:18,
fontWeight:"700",
cursor:"pointer"
}