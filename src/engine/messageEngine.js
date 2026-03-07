export function speakAction(action){

if(!("speechSynthesis" in window)) return

const text = `${action} 점수를 받았습니다`

const msg = new SpeechSynthesisUtterance(text)

msg.lang = "ko-KR"
msg.rate = 1
msg.pitch = 1

window.speechSynthesis.cancel()
window.speechSynthesis.speak(msg)

}