const synth = window.speechSynthesis

export function speakAction(text){

if(!text) return

// 🔥 기존 음성 완전 제거
synth.cancel()

const msg = new SpeechSynthesisUtterance()

msg.lang="ko-KR"

// 🔥 모든 케이스 강제 변환
let finalText = text

if(finalText.includes("올라갔습니다")){
finalText = finalText.replace("올라갔습니다","올라갑니다")
}

// 🔥 혹시 남아있을 수 있는 과거 문구 차단
if(finalText.includes("점수가 올라갔습니다")){
finalText = finalText.replace("점수가 올라갔습니다","점수가 올라갑니다")
}

msg.text = finalText

msg.volume=1
msg.rate=1
msg.pitch=1

synth.speak(msg)

}