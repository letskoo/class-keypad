import {useState} from "react"
import {loadSettings,saveSettings} from "../utils/settings"

export default function PasswordSettings(){

const[current,setCurrent]=useState("")
const[newPass,setNewPass]=useState("")

function save(){

const settings=loadSettings()

const saved=settings.password || "0000"

if(current!==saved){

alert("현재 비밀번호가 틀립니다")
return

}

if(newPass.length<4){

alert("비밀번호는 4자리 이상")
return

}

saveSettings({
password:newPass
})

alert("비밀번호 변경 완료")

setCurrent("")
setNewPass("")

}

return(

<div style={{marginTop:40}}>

<h2>관리자 비밀번호 변경</h2>

<div style={{marginTop:10}}>

<input
type="password"
placeholder="현재 비밀번호"
value={current}
onChange={(e)=>setCurrent(e.target.value)}
style={{padding:10,fontSize:16}}
/>

</div>

<div style={{marginTop:10}}>

<input
type="password"
placeholder="새 비밀번호"
value={newPass}
onChange={(e)=>setNewPass(e.target.value)}
style={{padding:10,fontSize:16}}
/>

</div>

<button
onClick={save}
style={{marginTop:20,padding:"10px 20px"}}
>
비밀번호 변경
</button>

</div>

)

}
