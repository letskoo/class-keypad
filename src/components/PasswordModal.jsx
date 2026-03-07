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
alert("비밀번호가 틀렸습니다")
setInput("")
}

}

return(

<div style={overlay}>

<div style={box}>

<h2>관리자 비밀번호</h2>

<div style={display}>
{input.replace(/./g,"●")}
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

<br/>

<button onClick={check}>확인</button>

<button onClick={onClose} style={{marginLeft:10}}>
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
width:320,
textAlign:"center"
}

const display={
fontSize:30,
marginBottom:20,
height:40
}

const keypad={
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:10
}

const btn={
padding:15,
fontSize:18
}