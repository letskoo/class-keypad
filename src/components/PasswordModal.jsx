import {useState} from "react"
import {loadSettings} from "../utils/settings"

export default function PasswordModal({onSuccess,onClose}){

const[input,setInput]=useState("")

function press(n){

if(n==="DEL"){
setInput(input.slice(0,-1))
return
}

if(input.length>=4) return

setInput(input+n)

}

function check(){

const settings = loadSettings()
const password = settings.password || "0000"

if(input===password){
onSuccess()
}else{
alert("비밀번호가 일치하지 않습니다")
setInput("")
}

}

return(

<div style={overlay}>

<div style={box}>

<h2 style={{marginBottom:20}}>관리자 비밀번호</h2>

<div style={display}>
{[0,1,2,3].map((_,i)=>{
const index = input.length - (3 - i) - 1
const value = index >= 0 ? input[index] : ""
return(
<div key={i} style={digitBox}>
{value || <div style={dot}/>}
</div>
)
})}
</div>

<div style={keypad}>

{["1","2","3","4","5","6","7","8","9","DEL","0"].map(k=>(

<button
key={k}
onClick={()=>press(k)}
style={btn}
>
{k}
</button>

))}

</div>

<div style={{display:"flex",gap:10,marginTop:20}}>

<button onClick={check} style={actionBtn}>
확인
</button>

<button onClick={onClose} style={actionBtn}>
취소
</button>

</div>

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
width:360,
textAlign:"center",
boxShadow:"0 10px 30px rgba(0,0,0,0.2)"
}

const display={
display:"flex",
justifyContent:"center",
gap:16,
marginBottom:30
}

const digitBox={
width:60,
height:60,
display:"flex",
alignItems:"center",
justifyContent:"center",
fontSize:32,
fontWeight:"700",
color:"#1e293b"
}

const dot={
width:10,
height:10,
borderRadius:"50%",
background:"#cbd5f5"
}

const keypad={
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:20
}

const btn={
height:60,
fontSize:24,
border:"none",
background:"none",
color:"#1e293b",
cursor:"pointer"
}

const actionBtn={
flex:1,
height:50,
borderRadius:12,
border:"none",
background:"#334155",
color:"#fff",
fontWeight:"700",
cursor:"pointer"
}