export function speakAction(action){

if(!("speechSynthesis" in window)) return

const msg = new SpeechSynthesisUtterance(`${action} 점수를 받았습니다`)

msg.lang = "ko-KR"
msg.rate = 1
msg.pitch = 1

window.speechSynthesis.cancel()
window.speechSynthesis.speak(msg)

}