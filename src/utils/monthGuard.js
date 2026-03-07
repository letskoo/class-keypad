export function checkMonthReset(){

const now = new Date()

const currentMonth =
now.getFullYear() + "-" + String(now.getMonth()+1).padStart(2,"0")

const savedMonth = localStorage.getItem("classMonth")

/* 첫 실행 */

if(!savedMonth){

localStorage.setItem("classMonth",currentMonth)
return

}

/* 월 변경 감지 */

if(savedMonth !== currentMonth){

/* 데이터 초기화 */

localStorage.removeItem("classLogs")
localStorage.removeItem("dailyActions")
localStorage.removeItem("dailyParticipants")
localStorage.removeItem("classBoss")

/* 새 월 기록 */

localStorage.setItem("classMonth",currentMonth)

/* 알림 (UI 영향 없음) */

console.log("NEW MONTH RESET")

}

}